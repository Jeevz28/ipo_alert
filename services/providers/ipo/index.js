const logger = require("../../../utils/logger");
const investorGainProvider = require("./investorgain.provider");
// const chittorgarhProvider = require("./chittorgarh.provider");
// const nseProvider = require("./nse.provider");

/**
 * Fetch IPOs using the available providers.
 *
 * Priority:
 * 1. InvestorGain
 * 2. Chittorgarh
 * 3. NSE
 */
const fetchIPOs = async () => {

    const providers = [
        investorGainProvider,
        // chittorgarhProvider,
        // nseProvider,
    ];

    for (const provider of providers) {

        try {

            logger.info(
                {
                    provider: provider.name,
                },
                "[Provider] Using Provider"
            );

            const ipos = await provider.fetchIPOs();

            if (Array.isArray(ipos)) {

                logger.info(
                    {
                        provider: provider.name,
                        total: ipos.length,
                    },
                    "[Provider] Fetch Successful"
                );

                return ipos;

            }

            logger.warn(
                {
                    provider: provider.name,
                },
                "[Provider] Invalid Provider Response"
            );

        } catch (err) {

            logger.error(
                {
                    provider: provider.name,
                    err,
                },
                "[Provider] Failed"
            );

        }

    }

    throw new Error(
        "All IPO providers failed."
    );

};


const fetchSubscription = async (providerId, companyName = null) => {

    const providers = [
        investorGainProvider,
        // chittorgarhProvider,
        // nseProvider,
    ];

    for (const provider of providers) {

        try {

            logger.info(
                {
                    provider: provider.name,
                    providerId,
                    companyName,
                },
                "[Provider] Fetching Subscription"
            );

            if (typeof provider.fetchSubscription !== "function") {

                logger.warn(
                    {
                        provider: provider.name,
                    },
                    "[Provider] Subscription Method Not Available"
                );

                continue;

            }

            const subscription =
                await provider.fetchSubscription(
                    providerId,
                    companyName
                );

            if (subscription) {

                return subscription;

            }

        } catch (err) {

            logger.error(
                {
                    provider: provider.name,
                    providerId,
                    companyName,
                    err,
                },
                "[Provider] Subscription Fetch Failed"
            );

        }

    }

    return null;

};

module.exports = {
    fetchIPOs,
    fetchSubscription,
};