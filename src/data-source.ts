import { DataSource } from 'typeorm';
import entities from './enitity';

export const MySqlDataSource = new DataSource({
  type: 'mysql',
  host: 'us-cdbr-east-05.cleardb.net',
  port: 3306,
  username: 'b1debf5dc6925d',
  password: '4e5f4ab8',
  database: 'heroku_9d924f8e65061f6',
  entities: entities,
  synchronize: true,
});

MySqlDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
