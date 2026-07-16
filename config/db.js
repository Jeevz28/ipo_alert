const mongoose = require("mongoose");

const logger = require("../utils/logger");

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        logger.info("[MongoDB] Connected");

    } catch (err) {

        logger.fatal({
            err,
        }, "[MongoDB] Connection Failed");

        process.exit(1);

    }

};

module.exports = connectDB;