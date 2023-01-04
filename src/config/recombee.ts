import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env`,
});

export const RecombeeConfig = {
  publicToken: process.env.PUBLIC_TOKEN,
  privateToken: process.env.PRIVATE_TOKEN,
  apiIdentifier: process.env.API_IDENTIFIER,
  myDb: process.env.MYDB,
  region: 'ap-se',
  host: process.env.HOST,
};
