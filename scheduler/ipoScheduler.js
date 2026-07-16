const cron = require("node-cron");

const ipoSyncJob = require("./ipoSyncJob");

const logger = require("../utils/logger");

const start = () => {

    logger.info("[Scheduler] IPO Scheduler Started");

    ipoSyncJob.run();

    cron.schedule("*/2 * * * *", async () => {

        await ipoSyncJob.run();

    });

};

module.exports = {
    start,
};