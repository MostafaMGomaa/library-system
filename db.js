const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

module.exports = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});
