require("dotenv").config();
const app = require("./src/app");
const config = require("./src/v1/config/index");
const mongoose = require("./src/v1/databases/init.mongodb");
const logger = require('./src/v1/utils/logger')

const PORT = config.app.port;
const MONGO_URI = config.db.uri;

let server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Connected mongoose success!...")
    server = app.listen(PORT, () => {
      console.log(`Server start with port ${PORT}`);
    });
    return true;


  } catch (error) {
    logger.error(`Cannot connect to database! ${error.message}`)
    return false;
    process.exit(0);
  }
}

process.on("SIGINT", async () => {
  if (server) {
    await server.close(() => console.log(`Exits server express`));
    await mongoose.connection.close()
    process.exit(0);
  }

});

startServer();

exports.startServer = startServer;