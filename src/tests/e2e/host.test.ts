import request from 'supertest';
import app from '../../app';
import sequelize from '../../config/database';
import { createInitialAdmin } from '../../config/adminSeed';
import { RoleType } from '../../enums/RoleType';
import { Room } from '../../models/Room';
import { RoomStatus } from '../../enums/RoomStatus';
import { RoomType } from '../../enums/RoomType';
import { ReservationStatus } from '../../enums/ReservationStatus';

describe('CT-E2E-02: Fluxo completo de hospedagem', () => {
  let adminToken: string;
  let managerToken: string;

  const userEmail = `user_${Date.now()}@hotel.com`;
  const userPassword = 'userPassword123';
  const userCpf = '12345678900';
  const userPhoneNumber = '123456789';
  const checkIn = new Date();
  const checkOut = new Date(checkIn); 
  checkOut.setDate(checkIn.getDate() + 2);
  

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync();
    await createInitialAdmin();

    const adminLogin = await request(app)
      .post('/auth/login')
      .send({
        email: 'adminJoseGlauber@hotel.com',
        password: 'JoseGlauber@123',
      });
    adminToken = adminLogin.body;

    const roomRes = await request(app)
      .post('/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        number: 101,
        type: RoomType.SINGLE,
        status: RoomStatus.AVAILABLE,
        dailyRate: 100.00
      });
    
    expect(roomRes.status).toBe(201);

  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('Usuário registra-se, realiza login, faz reserva, check-in e check-out', async () => {
    
    const registerRes = await request(app)
      .post('/auth/register-guest')
      .send({
        name: 'User Test',
        email: userEmail,
        password: userPassword,
        cpf: userCpf,
        phoneNumber: userPhoneNumber
      });

    expect(registerRes.status).toBe(201);
    
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: userPassword
      });
    
    expect(loginRes.status).toBe(200);
    const userToken = loginRes.body;
    
    const getRoomsRes = await request(app)
      .get('/rooms/available')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(getRoomsRes.status).toBe(200);
    const availableRooms = getRoomsRes.body;
    expect(availableRooms.length).toEqual(1);
    
    const reservationRes = await request(app)
      .post('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        roomId: availableRooms[0].id,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED
      });
    
    expect(reservationRes.status).toBe(201);

    const checkInRes = await request(app)
      .patch(`/reservations/${reservationRes.body.id}/checkin`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(checkInRes.status).toBe(200);
    expect(checkInRes.body.status).toBe(ReservationStatus.CHECKED_IN);

    const checkOutRes = await request(app)
      .patch(`/reservations/${reservationRes.body.id}/checkout`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(checkOutRes.status).toBe(200);
    expect(checkOutRes.body.status).toBe(ReservationStatus.CHECKED_OUT);


    const getDirtyRoomsRes = await request(app)
      .get('/rooms/dirty')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(getDirtyRoomsRes.status).toBe(200);
    const dirtyRooms = getDirtyRoomsRes.body;
    expect(dirtyRooms.length).toEqual(1);

  });
      
});
