const axios = require("axios");
const logger = require("../../../utils/logger");

const IPO_LIST_URL =
  "https://webnodejs.investorgain.com/cloud/v2/ipodashboard/ipoList-read/IPO";

const SUBSCRIPTION_URL =
  "https://webnodejs.investorgain.com/cloud/v2/ipo/ipo-subscription-read";

const fetchIPOs = async () => {
  logger.info({}, "[InvestorGain] Fetching IPO List");

  const { data } = await axios.get(IPO_LIST_URL);

  if (data.msg !== 1) {
    throw new Error("Unable to fetch IPO list.");
  }

  const result = [];

  for (const ipo of data.ipoList) {
    let latestSubscription = null;

    if (["O", "C", "LP", "LN"].includes(ipo.ipo_status_short)) {
      try {
        logger.info(
          {
            ipo: ipo.company_short_name,
          },
          "[InvestorGain] Fetching Subscription",
        );

        const subscriptionResponse = await axios.get(
          `${SUBSCRIPTION_URL}/${ipo.id}`,
        );

        const bidding = subscriptionResponse.data?.data?.ipoBiddingData ?? [];

        if (bidding.length > 0) {
          latestSubscription = bidding[bidding.length - 1];
        }
      } catch (err) {
        logger.warn(
          {
            ipo: ipo.company_short_name,
            err,
          },
          "[InvestorGain] Subscription Fetch Failed",
        );
      }
    }

    result.push({
      list: ipo,

      subscription: latestSubscription,
    });
  }

  logger.info(
    {
      total: result.length,
    },
    "[InvestorGain] IPO List Prepared",
  );

  return result;
};

module.exports = {
  name: "InvestorGain",

  fetchIPOs,
};
