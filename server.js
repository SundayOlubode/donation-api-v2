const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT;
const logger = require("./utils/logger");
const Cache = require("./configs/redis");
const cron = require("node-cron");
const Users = require("./models/userModel");
const { EmailToUsers } = require("./utils/emails");

// UNCAUGHT EXCEPTION
process.on("uncaughtException", (error, origin) => {
  logger.error("UNCAUGHT EXCEPTION! 🔥 Shutting Down...");
  logger.error(error.name, error.message);
  process.exit(1);
});

const Notification = cron.schedule("0 0 26 * * *", async () => {
  try {
    logger.info("CRON JOB STARTED...");
    const users = await Users.find();

    const url = `${process.env.FRONTEND_URL}`;

    for (let user of users) {
      // console.log(user);
      await new EmailToUsers(user, url).sendMonthlyReminder();
    }
  } catch (error) {
    logger.error(error);
  }
});

const server = app.listen(PORT, () => {
  Cache.connect();
  logger.info(`server listening on port ${PORT}...`);
  Notification.start();
});

//UNHANDLED REJECTION
process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION! 🔥 Shutting Down...");
  logger.error({ REASON: reason });
  server.close(() => {
    process.exit(1);
  });
});
