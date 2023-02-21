const mongoose = require("mongoose");
const logger = require("../utils/logger");

// all executed methods log output to console
mongoose.set("debug", true);

// disable colors in debug mode
mongoose.set("debug", { color: false });

// get mongodb-shell friendly output (ISODate)
mongoose.set("debug", { shell: true });

mongoose.connection.on('disconnected', () => {
    logger.info('Disconnected to mongodb..')
})

module.exports = mongoose;
