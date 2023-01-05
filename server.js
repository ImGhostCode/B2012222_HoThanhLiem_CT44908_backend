const app = require("./app");
const config = require("./app/config/index");
const MongoDB = require("./app/utils/mongodb.util");
//start server

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to database!");

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to database!", error);
    process.exit();
  }
}

startServer();
