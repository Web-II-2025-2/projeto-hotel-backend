import request from "supertest";
import app from "../../app";
import { createInitialAdmin } from "../../config/adminSeed";
import { ReservationStatus } from "../../enums/ReservationStatus";
import {
  createAdminAndLogin,
  createReservation,
  createRoom,
  loginGuest,
  registerGuest,
} from "./helpers";

describe("CT-E2E-02: Full hosting lifecycle flow.", () => {
  let adminToken: string;

  const userEmail = `user_${Date.now()}@hotel.com`;
  const userPassword = "userPassword123";
  const userCpf = "12345678900";
  const userPhoneNumber = "123456789";
  const checkIn = new Date();
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 2);

  beforeAll(async () => {
    await createInitialAdmin();

    adminToken = await createAdminAndLogin(app);
    await createRoom(app, adminToken);
  });

  it("should allow a guest to complete the full hospitality flow", async () => {
    const registerRes = await request(app).post("/auth/register-guest").send({
      name: "User Test",
      email: userEmail,
      password: userPassword,
      cpf: userCpf,
      phoneNumber: userPhoneNumber,
    });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app).post("/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    expect(loginRes.status).toBe(200);
    const userToken = loginRes.body;

    const getRoomsRes = await request(app)
      .get("/rooms/available")
      .set("Authorization", `Bearer ${userToken}`);

    expect(getRoomsRes.status).toBe(200);
    const availableRooms = getRoomsRes.body;
    expect(availableRooms.length).toEqual(1);

    const reservationRes = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        roomId: availableRooms[0].id,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED,
      });

    expect(reservationRes.status).toBe(201);

    const checkInRes = await request(app)
      .patch(`/reservations/${reservationRes.body.id}/checkin`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(checkInRes.status).toBe(200);
    expect(checkInRes.body.status).toBe(ReservationStatus.CHECKED_IN);

    const checkOutRes = await request(app)
      .patch(`/reservations/${reservationRes.body.id}/checkout`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(checkOutRes.status).toBe(200);
    expect(checkOutRes.body.status).toBe(ReservationStatus.CHECKED_OUT);

    const getDirtyRoomsRes = await request(app)
      .get("/rooms/dirty")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(getDirtyRoomsRes.status).toBe(200);
    const dirtyRooms = getDirtyRoomsRes.body;
    expect(dirtyRooms.length).toEqual(1);
  });
});

describe(`CT-E2E-03: Attempted reservation on an occupied room; User 1 cancels the reservation,
  and User 2 successfully reserves the room.`, () => {
  let adminToken: string;
  let roomId: number;
  let registerRes1: any;
  let registerRes2: any;

  const user2Email = `user2_${Date.now()}@hotel.com`;
  const user2Password = "user2Password123";
  const user2Cpf = "22222222222";
  const user2PhoneNumber = "222222222";

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
      phoneNumber: user2PhoneNumber,
    });
  });

  it(`Allow user2 to reserve an occupied room after user1 cancels it.`, async () => {
    const user1Token = await loginGuest(
      app,
      registerRes1.data.email,
      registerRes1.data.password,
    );
    const user2Token = await loginGuest(
      app,
      registerRes2.data.email,
      registerRes2.data.password,
    );

    const createReservationRes1 = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED,
      });

    expect(createReservationRes1.status).toBe(201);

    const createReservationRes2 = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED,
      });

    expect(createReservationRes2.status).toBe(409);

    const cancelReservationRes1 = await request(app)
      .delete(`/reservations/${createReservationRes1.body.id}`)
      .set("Authorization", `Bearer ${user1Token}`);

    expect(cancelReservationRes1.status).toBe(204);

    const createReservationRes2Retry = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED,
      });

    expect(createReservationRes2Retry.status).toBe(201);
  });
});

describe("Room maintenance and status lifecycle.", () => {
  let adminToken: string;
  let userToken1: string;
  let userToken2: string;
  let roomId: number;
  let registerRes1: any;
  let registerRes2: any;
  let reservationRes: any;

  const user2Email = `user2_${Date.now()}@hotel.com`;
  const user2Password = "user2Password123";
  const user2Cpf = "22222222222";
  const user2PhoneNumber = "222222222";

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
      phoneNumber: user2PhoneNumber,
    });

    userToken1 = await loginGuest(
      app,
      registerRes1.data.email,
      registerRes1.data.password,
    );

    userToken2 = await loginGuest(
      app,
      registerRes2.data.email,
      registerRes2.data.password,
    );

    reservationRes = await createReservation(app, userToken1, {});
  });

  it(`User A checks in and out; User B checks availability but cannot see the recently vacated room as
    it is marked dirty; after cleaning, User B successfully reserves it.`, async () => {
    const checkInRes = await request(app)
      .patch(`/reservations/${reservationRes.reservationRes.body.id}/checkin`)
      .set("Authorization", `Bearer ${userToken1}`);

    expect(checkInRes.status).toBe(200);

    const checkOutRes = await request(app)
      .patch(`/reservations/${reservationRes.reservationRes.body.id}/checkout`)
      .set("Authorization", `Bearer ${userToken1}`);

    expect(checkOutRes.status).toBe(200);

    const getAvailableRoomsRes = await request(app)
      .get("/rooms/available")
      .set("Authorization", `Bearer ${userToken2}`);

    expect(getAvailableRoomsRes.body.length).toBe(0);

    const getDirtyRoomsRes = await request(app)
      .get("/rooms/dirty")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(getDirtyRoomsRes.body.length).toBe(1);

    const cleanRoomRes = await request(app)
      .patch(`/employees/${roomId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(cleanRoomRes.status).toBe(200);

    const getAvailableRoomsResAfterCleaning = await request(app)
      .get("/rooms/available")
      .set("Authorization", `Bearer ${userToken2}`);

    expect(getAvailableRoomsResAfterCleaning.body.length).toBe(1);

    checkIn.setDate(checkIn.getDate() + 5);
    checkOut.setDate(checkOut.getDate() + 5);

    const createReservationRes = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${userToken2}`)
      .send({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        reservationStatus: ReservationStatus.CONFIRMED,
      });

    expect(createReservationRes.status).toBe(201);
  });
});
