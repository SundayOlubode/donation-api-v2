const app = require("./app")
require("dotenv").config()
const PORT = process.env.PORT
const logger = require("./utils/logger")
const Cache = require("./configs/redis")

const WhatsApp = require("whatsapp")

const SENDER_NUMBER = process.env.WA_PHONE_NUMBER_ID
const RECIPIENT_NUMBER = process.env.WA_RECIPIENT_NUMBER_ID
// Your test sender phone number
const wa = new WhatsApp(SENDER_NUMBER)

// Enter the recipient phone number
const recipient_number = RECIPIENT_NUMBER

console.log("Sending message...", recipient_number, SENDER_NUMBER)

async function send_message() {
  try {
    const sent_text_message = wa.messages.text(
      { body: "Hello world" },
      recipient_number,
    )

    await sent_text_message.then((res) => {
      // console.log(res.rawResponse())
      console.log("sent!")
    })
  } catch (e) {
    console.log(JSON.stringify(e))
  }
}

send_message()

// UNCAUGHT EXCEPTION
process.on("uncaughtException", (error, origin) => {
  logger.error("UNCAUGHT EXCEPTION! 🔥 Shutting Down...")
  logger.error(error.name, error.message)
  process.exit(1)
})

const server = app.listen(PORT, () => {
  Cache.connect()
  logger.info(`server listening on port ${PORT}...`)
})

//UNHANDLED REJECTION
process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION! 🔥 Shutting Down...")
  logger.error({ REASON: reason })
  server.close(() => {
    process.exit(1)
  })
})
