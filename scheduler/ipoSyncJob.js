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

        let synced = 0;
        let failed = 0;

        for (const ipo of normalizedIPOs) {

            try {

                /**
                 * Special handling for incomplete UPCOMING IPOs.
                 *
                 * InvestorGain can return an upcoming IPO before
                 * its opening/closing dates are available.
                 *
                 * Since UPCOMING IPOs cannot trigger subscription
                 * alerts yet, safely skip persistence for this run.
                 */
                if (
                    ipo.status === "UPCOMING" &&
                    (!ipo.openDate || !ipo.closeDate)
                ) {

                    logger.warn(
                        {
                            providerId: ipo.providerId,
                            companyName: ipo.companyName,
                            status: ipo.status,
                            openDate: ipo.openDate,
                            closeDate: ipo.closeDate,
                        },
                        "[IPO] Upcoming IPO Missing Dates - Skipping"
                    );

                    failed++;

                    continue;

                }

                const savedIPO =
                    await ipoService.upsertIPO(ipo);

                synced++;

                logger.info(
                    {
                        ipo: savedIPO.companyName,
                        providerId: savedIPO.providerId,
                        status: savedIPO.status,
                    },
                    "[IPO] Synced"
                );

                /**
                 * Only OPEN IPOs are evaluated for alerts.
                 *
                 * CT is normalized to OPEN by the provider normalizer.
                 */
                if (savedIPO.status === "OPEN") {

                    try {

                        await alertEngine.processIPO(
                            savedIPO
                        );

                    } catch (err) {

                        logger.error(
                            {
                                err,
                                providerId: savedIPO.providerId,
                                companyName: savedIPO.companyName,
                            },
                            "[Alert Engine] Processing Failed"
                        );

                    }

                }

            } catch (err) {

                failed++;

                logger.error(
                    {
                        err,
                        providerId: ipo.providerId,
                        companyName: ipo.companyName,
                        status: ipo.status,
                        openDate: ipo.openDate,
                        closeDate: ipo.closeDate,
                    },
                    "[IPO] Sync Failed - Skipping IPO"
                );

                /**
                 * Important:
                 *
                 * Never allow one bad IPO to stop the scheduler.
                 */
                continue;

            }

        }

        logger.info(
            {
                total: normalizedIPOs.length,
                synced,
                failed,
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