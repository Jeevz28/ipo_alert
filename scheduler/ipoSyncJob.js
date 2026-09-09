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

        const normalizedIPOs =
            normalizeIPOs(rawIPOs);

        let synced = 0;
        let failed = 0;

        /**
         * Keep track of IPOs that were already processed
         * through the InvestorGain IPO list.
         *
         * These IPOs do not need to be processed again
         * during the active IPO refresh stage below.
         */
        const syncedProviderIds = new Set();

        /**
         * --------------------------------------------------
         * STEP 1
         * Sync IPOs returned by InvestorGain IPO List
         * --------------------------------------------------
         */
        for (const ipo of normalizedIPOs) {

            try {

                /**
                 * Special handling for incomplete UPCOMING IPOs.
                 *
                 * InvestorGain can return an upcoming IPO before
                 * its opening/closing dates are available.
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

                syncedProviderIds.add(
                    savedIPO.providerId
                );

                logger.info(
                    {
                        ipo: savedIPO.companyName,
                        providerId: savedIPO.providerId,
                        status: savedIPO.status,
                    },
                    "[IPO] Synced"
                );

                /**
                 * CT is already normalized to OPEN.
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

                continue;
            }
        }

        /**
         * --------------------------------------------------
         * STEP 2
         * Refresh active IPOs already stored in MongoDB
         *
         * This is independent of InvestorGain's IPO list.
         *
         * An IPO can disappear from ipoList-read/IPO while
         * its subscription data is still available through
         * ipo-subscription-read/{providerId}.
         * --------------------------------------------------
         */
        let activeIPOs = [];

        try {

            activeIPOs =
                await ipoService.getActiveIPOs();

            logger.info(
                {
                    total: activeIPOs.length,
                },
                "[Scheduler] Active IPOs Found"
            );

        } catch (err) {

            logger.error(
                {
                    err,
                },
                "[Scheduler] Failed To Find Active IPOs"
            );

            activeIPOs = [];

        }

        /**
         * Process active IPOs that were NOT already handled
         * by the InvestorGain IPO list above.
         */
        for (const ipo of activeIPOs) {

            /**
             * Already processed during Step 1.
             */
            if (
                syncedProviderIds.has(
                    ipo.providerId
                )
            ) {
                continue;
            }

            try {

                logger.info(
                    {
                        providerId: ipo.providerId,
                        companyName: ipo.companyName,
                        openDate: ipo.openDate,
                        closeDate: ipo.closeDate,
                    },
                    "[Scheduler] Refreshing Active IPO"
                );

                /**
                 * Fetch latest subscription directly using
                 * the provider ID stored in MongoDB.
                 */
                const latestSubscription =
                    await ipoProvider.fetchSubscription(
                        ipo.providerId,
                        ipo.companyName
                    );

                if (!latestSubscription) {

                    logger.warn(
                        {
                            providerId: ipo.providerId,
                            companyName: ipo.companyName,
                        },
                        "[Scheduler] Active IPO Subscription Missing"
                    );

                    continue;
                }

                /**
                 * Update ONLY subscription values.
                 *
                 * Do not overwrite IPO metadata.
                 */
                const updatedIPO =
                    await ipoService.updateSubscription(
                        ipo._id,
                        latestSubscription
                    );

                logger.info(
                    {
                        providerId: updatedIPO.providerId,
                        companyName: updatedIPO.companyName,
                        overall:
                            updatedIPO.subscriptions.overall,
                        retail:
                            updatedIPO.subscriptions.retail,
                        qib:
                            updatedIPO.subscriptions.qib,
                        nii:
                            updatedIPO.subscriptions.nii,
                    },
                    "[Scheduler] Active IPO Subscription Updated"
                );

                /**
                 * Evaluate alerts using the freshly updated
                 * subscription values.
                 */
                try {

                    await alertEngine.processIPO(
                        updatedIPO
                    );

                } catch (err) {

                    logger.error(
                        {
                            err,
                            providerId: updatedIPO.providerId,
                            companyName: updatedIPO.companyName,
                        },
                        "[Alert Engine] Active IPO Processing Failed"
                    );

                }

            } catch (err) {

                failed++;

                logger.error(
                    {
                        err,
                        providerId: ipo.providerId,
                        companyName: ipo.companyName,
                    },
                    "[Scheduler] Active IPO Refresh Failed"
                );

                /**
                 * Never allow one active IPO to stop
                 * monitoring of other IPOs.
                 */
                continue;
            }
        }

        logger.info(
            {
                total: normalizedIPOs.length,
                activeIPOs: activeIPOs.length,
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