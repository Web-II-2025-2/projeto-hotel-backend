import request from 'supertest';
import app from '../../app';
import { Credential } from '../../models/Credential';
import { RoleType } from '../../enums/RoleType';
import sequelize from '../../config/database';
import { createInitialAdmin } from '../../config/adminSeed';

describe(`CT-E2E-01: Permission Lifecycle, Admin promotes guest to Manager
  and the new manager attemps suceffully to create a room.`, () => {

  let adminToken: string;
  let userId: number;
  const userEmail = `user_test_${Date.now()}@example.com`;
  const userPassword = 'password123';
  const employeeEmail = `employee_${Date.now()}@hotel.com`;
  const employeePassword = 'password123';

  // Authenticate admin user and get token
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

  it(`Should register a new guest user, this user will attempt to create a employee and fail,
     then the admin promotes him to a manager and now, should sucessufilly create a new employee`, async () => {
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

    const guestTokenRes = await request(app)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: userPassword
      });

    expect(guestTokenRes.status).toBe(200);
    const guestToken = guestTokenRes.body;

    const createEmployeeResError = await request(app)
      .post('/auth/register-employee')
      .set('Authorization', `Bearer ${guestToken}`) // Using admin token to create employee on behalf of guest (should fail)
      .send({
        name: 'New Employee',
        email: employeeEmail,
        password: employeePassword
      });

    console.log(createEmployeeResError.body);
    expect(createEmployeeResError.status).toBe(403);

    const promoteRes = await request(app)
      .patch(`/auth/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ 
        email: userEmail,
        role: RoleType.MANAGER 
      });

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
        name: 'Real Employee',
        email: employeeEmail,
        password: employeePassword
      });

    // Proof that the new manager can create employees (requires manager-level permissions)
    expect(createEmployeeRes.status).toBe(201);
    expect(createEmployeeRes.body.message).toContain('registered successfully');
  });
});
