const { createClient } = require('redis');
require('dotenv').config();
const logger = require('../utils/logger');
const appError = require('../utils/appError');

const REDIS_PORT = parseInt(process.env.REDIS_PORT);
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

class Cache {

  constructor() {
    this.client = createClient({
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
      }
    });
  }
  async connect() {
    try {

      await this.client.connect()

    } catch (error) {
      logger.error(error.message)
      throw new appError(error.message, 500)
    }
  }
}

const { client } = new Cache()

module.exports = client;