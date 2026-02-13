import request from 'supertest';
import app from '../../app';
import { Credential } from '../../models/Credential';
import { RoleType } from '../../enums/RoleType';
import sequelize from '../../config/database';
import { createInitialAdmin } from '../../config/adminSeed';

describe('CT-E2E-01: Ciclo de Vida de Permissões (Admin -> Manager)', () => {
  let adminToken: string;
  let userId: number;
  const userEmail = `user_test_${Date.now()}@example.com`;
  const userPassword = 'password123';

  // Authenticate admin user and get token before tests
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync(); 
    await createInitialAdmin();

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'adminJoseGlauber@hotel.com',
        password: 'JoseGlauber@123',
      });
    
    adminToken = loginRes.body; 
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('Should promote guest to manager and validate new permissions', async () => {
    const registerRes = await request(app)
      .post('/auth/register-guest')
      .send({
        name: 'Guest User',
        email: userEmail,
        password: userPassword,
        cpf: '12345678900',
        phoneNumber: '123456789'
      });
    
    expect(registerRes.status).toBe(201);
    const userCredential = await Credential.findOne({ where: { email: userEmail } });
    expect(userCredential).not.toBeNull();
    userId = userCredential!.id;

    const promoteRes = await request(app)
      .patch(`/auth/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ 
        email: userEmail,
        role: RoleType.MANAGER 
      });

    if (promoteRes.status !== 200) {
      console.error('Promotion failed:', promoteRes.body);
    }
    expect(promoteRes.status).toBe(200);

    const managerLoginRes = await request(app)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: userPassword
      });

    expect(managerLoginRes.status).toBe(200);
    const managerToken = managerLoginRes.body;

    const createEmployeeRes = await request(app)
      .post('/auth/register-employee')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        name: 'New Employee',
        email: `employee_${Date.now()}@hotel.com`,
        password: 'password123'
      });

    if (createEmployeeRes.status !== 201) {
       console.error('Create Employee failed:', createEmployeeRes.body);
    }

    // Proof that the new manager can create employees (requires manager-level permissions)
    expect(createEmployeeRes.status).toBe(201);
    expect(createEmployeeRes.body.message).toContain('registered successfully');
  });
});
