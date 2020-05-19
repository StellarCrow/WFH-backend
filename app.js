const express = require('express');

const app = express();
require('module-alias/register');
const config = require('config');
const authRouter = require('./api/routes/authRouter');

const { PORT } = config.get('SERVER');
const { LVL } = config.get('LOGGER');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = LVL;
const dbConnection = require('./api/utilits/dbConnection');
const { ERROR } = require('./data/logs');

const mongoConnection = dbConnection();

if (!mongoConnection) {
  logger.error(ERROR.DB_CONNECTION);
  process.exit();
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  logger.info(`Listening to requests on http://localhost:${PORT}`);
});
