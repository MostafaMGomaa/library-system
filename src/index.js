const dotenv = require('dotenv');

const app = require('./app');
const sequelize = require('./db');

dotenv.config({ path: `${__dirname}/.env` });

const PORT = process.env.PORT || 3000;

sequelize
  .query('SET FOREIGN_KEY_CHECKS = 0')
  .then(() => sequelize.sync({ force: true }))
  .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
  .then(() => console.log(`DB on ${process.env.NODE_ENV}`))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`Server listen on ${PORT} `));
