import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import entities from './enitity';

dotenv.config({
  path: `.env`,
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST.toString(),
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME.toString(),
  password: process.env.DATABASE_PASSWORD.toString(),
  database: process.env.DATABASE_NAME.toString(),
  entities: entities,
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
