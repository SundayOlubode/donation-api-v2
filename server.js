const app = require('./app')
require('dotenv').config()
const PORT = process.env.PORT
const logger = require('./utils/logger')
const Cache = require('./configs/redis')

// UNCAUGHT EXCEPTION
process.on('uncaughtException', (error, origin) => {
  logger.error("UNCAUGHT EXCEPTION! 🔥 Shutting Down...");
  logger.error(error.name, error.message);
  process.exit(1);
})

const server = app.listen(PORT, () => {
  Cache.connect()
  logger.info(`server listening on port ${PORT}...`);
})

//UNHANDLED REJECTION
process.on('unhandledRejection', (reason) => {
  logger.error("UNHANDLED REJECTION! 🔥 Shutting Down...");
  logger.error({ 'REASON': reason });
  server.close(() => {
    process.exit(1);
  });
})