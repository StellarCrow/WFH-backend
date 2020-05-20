const express = require('express');

const app = express();
require('module-alias/register');
const config = require('config');
const log4js = require('log4js');
const authRouter = require('./api/routes/authRouter');

const { PORT } = config.get('SERVER');
const { LVL } = config.get('LOGGER');


const logger = log4js.getLogger();
logger.level = process.env.LVL || LVL;
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

app.listen(process.env.PORT || PORT, () => {
  logger.info(`Listening to requests on ${process.env.PORT || PORT}`);
});
