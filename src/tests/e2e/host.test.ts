import request from 'supertest';
import app from '../../app';
import sequelize from '../../config/database';
import { createInitialAdmin } from '../../config/adminSeed';
import { RoomStatus } from '../../enums/RoomStatus';
import { RoomType } from '../../enums/RoomType';
import { ReservationStatus } from '../../enums/ReservationStatus';
import { clearDatabase, createAdminAndLogin, createRoom, loginGuest, registerGuest } from './helpers';
import { create } from 'domain';

describe('CT-E2E-02: Fluxo completo de hospedagem', () => {

  let adminToken: string;

  const userEmail = `user_${Date.now()}@hotel.com`;
  const userPassword = 'userPassword123';
  const userCpf = '12345678900';
  const userPhoneNumber = '123456789';
  const checkIn = new Date();
  const checkOut = new Date(checkIn); 
  checkOut.setDate(checkIn.getDate() + 2);
  
  beforeAll(async () => {
    await createInitialAdmin();

    adminToken = await createAdminAndLogin(app);
    await createRoom(app, adminToken);

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


describe(`CT-E2E-03: Tentativa de reserva ocupada por outro usuário,
  usuário 1 cancela reserva e usuário 2 realiza reserva com sucesso`, () => {

  let adminToken: string;
  let roomId: number;
  let registerRes1: any;
  let registerRes2: any;

  const user2Email = `user2_${Date.now()}@hotel.com`;
  const user2Password = 'user2Password123';
  const user2Cpf = '22222222222';
  const user2PhoneNumber = '222222222';

  const checkIn = new Date();
  const checkOut = new Date(checkIn); 
  checkOut.setDate(checkIn.getDate() + 2);

  beforeAll(async () => {
    await createInitialAdmin();

    adminToken = await createAdminAndLogin(app);
    
    roomId = await createRoom(app, adminToken);

    registerRes1 = await registerGuest(app, {});
    registerRes2 = await registerGuest(app, {
      email: user2Email,
      password: user2Password,
      cpf: user2Cpf,
      phoneNumber: user2PhoneNumber
    });

  });

  it('Usuário 1 reserva, usuário 2 tenta reservar o mesmo quarto, usuário 1 cancela e usuário 2 reserva com sucesso', async () => {
    
    const user1Token = await loginGuest(app, registerRes1.data.email, registerRes1.data.password);
    const user2Token = await loginGuest(app, registerRes2.data.email, registerRes2.data.password);

    const createReservationRes1 = await request(app)
      .post('/reservations')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED
      });
    
    expect(createReservationRes1.status).toBe(201);

    const createReservationRes2 = await request(app)
      .post('/reservations')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED
      });
    
    expect(createReservationRes2.status).toBe(409);

    const cancelReservationRes1 = await request(app)
      .delete(`/reservations/${createReservationRes1.body.id}`)
      .set('Authorization', `Bearer ${user1Token}`);
    
    expect(cancelReservationRes1.status).toBe(204);

    const createReservationRes2Retry = await request(app)
      .post('/reservations')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED
      });
    
    expect(createReservationRes2Retry.status).toBe(201);

  });    
});