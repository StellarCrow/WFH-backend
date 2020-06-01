require('module-alias/register');

const express = require('express');
const cors = require('cors');
const config = require('config');
const log4js = require('log4js');
const authRouter = require('./api/routes/authRouter');
const userRouter = require('./api/routes/userRouter');

const app = express();

const { ERROR } = require('./data/logs');
const { PORT } = config.get('SERVER');
const { LVL } = config.get('LOGGER');

// Logger setup
const logger = log4js.getLogger();
logger.level = process.env.LVL || LVL;

// MongoDB connection
const dbConnection = require('./api/utilits/dbConnection');
const mongoConnection = dbConnection();
if (!mongoConnection) {
  logger.error(ERROR.DB_CONNECTION);
  process.exit();
}

// General middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// Run HTTP server
const httpServer = app.listen(process.env.PORT || PORT, () => {
  logger.info(`Listening to requests on ${process.env.PORT || PORT}`);
});

// Establish and handle socket.io connection
const socketIO = require('socket.io')(httpServer);
const handleSockets = require('./socket');
handleSockets(socketIO);