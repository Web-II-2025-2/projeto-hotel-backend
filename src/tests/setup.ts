import sequelize from '../config/database';
import { clearDatabase } from './e2e/helpers';

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); 
  } catch (error) {
    console.error('FATAL: Não foi possível iniciar o banco de testes.', error);
    throw error;
  }
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await sequelize.close();
});