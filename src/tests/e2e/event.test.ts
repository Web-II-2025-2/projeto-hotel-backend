import request from "supertest";
import app from "../../app";
import { createInitialAdmin } from "../../config/adminSeed";
import { createAdminAndLogin, loginGuest, registerGuest } from "./helpers";

describe(`CT-E2E-05: Event creation and join request; when a second user attempts to join,
    the event should return as full.`, () => {
  let adminToken: string;
  let registerRes1: any;
  let registerRes2: any;
  const user2Email = `user2_${Date.now()}@hotel.com`;
  const user2Password = "user2Password123";
  const user2Cpf = "22222222222";
  const user2PhoneNumber = "222222222";

  beforeAll(async () => {
    await createInitialAdmin();
    adminToken = await createAdminAndLogin(app);

    registerRes1 = await registerGuest(app, {});
    registerRes2 = await registerGuest(app, {
      email: user2Email,
      password: user2Password,
      cpf: user2Cpf,
      phoneNumber: user2PhoneNumber,
    });
  });

  it(`Has a event with capacity 1, then two different users should attempt to join,
     the first should succeed and the second should fail`, async () => {
    const createEventRes = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Event Test",
        description: "This is a test event",
        date: new Date(),
        time: "18:00",
        capacity: 1,
        location: "Hotel Lobby",
      });

    expect(createEventRes.status).toBe(201);

    const eventId = createEventRes.body.id;

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

    const joinEventRes1 = await request(app)
      .post(`/events/${eventId}/join`)
      .set("Authorization", `Bearer ${user1Token}`);

    expect(joinEventRes1.status).toBe(200);
    const joinEventRes2 = await request(app)
      .post(`/events/${eventId}/join`)
      .set("Authorization", `Bearer ${user2Token}`);

    expect(joinEventRes2.status).toBe(400);
  });
});
