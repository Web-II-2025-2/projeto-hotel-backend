import request from "supertest";
import sequelize from "../../config/database";

export const createAdminAndLogin = async (app: any) => {
  let adminToken: string;
  const adminLogin = await request(app).post("/auth/login").send({
    email: "adminJoseGlauber@hotel.com",
    password: "JoseGlauber@123",
  });
  adminToken = adminLogin.body;
  return adminToken;
};

export const createRoom = async (app: any, token: string) => {
  const roomRes = await request(app)
    .post("/rooms")
    .set("Authorization", `Bearer ${token}`)
    .send({
      number: 101,
      type: "SINGLE",
      status: "AVAILABLE",
      dailyRate: 100.0,
    });

  return roomRes.body.id;
};


export const clearDatabase = async () => {
  await sequelize.query('PRAGMA foreign_keys = OFF');
  await sequelize.sync({ force: true });
  await sequelize.query('PRAGMA foreign_keys = ON');
};

export const registerGuest = async (app: any, overrides: {}) => {
  const defaultPayload = {
    name: "Guest User",
    email: `guest_${Date.now()}@example.com`,
    password: "password123",
    cpf: "12345678900",
    phoneNumber: "123456789",
  };
  const data = { ...defaultPayload, ...overrides };
  const registerRes = await request(app)
    .post("/auth/register-guest")
    .send(data);
  return {registerRes, data};
};

export const loginGuest = async (app: any, email: string, password: string) => {
  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email, password });
  return loginRes.body;
}