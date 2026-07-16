const ipoProvider = require("../services/providers/ipo");
const { normalizeIPOs } = require("../services/providers/ipo/normalizer");
const ipoService = require("../services/ipoService");
const alertEngine = require("../services/alertEngine");
const dateTime = require("../utils/dateTime");
const logger = require("../utils/logger");

const run = async () => {

    const startedAt = Date.now();

    try {

        logger.info(
            {},
            "[Scheduler] IPO Sync Started"
        );

        logger.info(
            {
                time: dateTime.format(dateTime.now()),
            },
            "[Scheduler] Execution Time"
        );

        const rawIPOs =
            await ipoProvider.fetchIPOs();

        logger.info(
            {
                total: rawIPOs.length,
            },
            "[Provider] IPOs Fetched"
        );

        if (rawIPOs.length === 0) {

            logger.info(
                {
                    duration: `${Date.now() - startedAt} ms`,
                },
                "[Scheduler] No IPOs Found"
            );

            return;

        }

        const normalizedIPOs =
            normalizeIPOs(rawIPOs);

        for (const ipo of normalizedIPOs) {

            const savedIPO =
                await ipoService.upsertIPO(ipo);

            logger.info(
                {
                    ipo: savedIPO.companyName,
                    providerId: savedIPO.providerId,
                    status: savedIPO.status,
                },
                "[IPO] Synced"
            );

            if (savedIPO.status === "OPEN") {
                await alertEngine.processIPO(savedIPO);
            }

        }

        logger.info(
            {
                total: normalizedIPOs.length,
                duration: `${Date.now() - startedAt} ms`,
            },
            "[Scheduler] IPO Sync Completed"
        );

    } catch (err) {

        logger.error(
            {
                err,
            },
            "[Scheduler] IPO Sync Failed"
        );

    }

};

module.exports = {
    run,
};