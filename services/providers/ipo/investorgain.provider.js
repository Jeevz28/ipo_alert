const axios = require("axios");
const logger = require("../../../utils/logger");

const IPO_LIST_URL =
  "https://webnodejs.investorgain.com/cloud/v2/ipodashboard/ipoList-read/IPO";

const SUBSCRIPTION_URL =
  "https://webnodejs.investorgain.com/cloud/v2/ipo/ipo-subscription-read";

/**
 * Fetch latest subscription data for an IPO
 *
 * Used independently of the IPO list endpoint.
 * This is important because InvestorGain may remove
 * an already-known IPO from ipoList-read/IPO.
 */
const fetchSubscription = async (providerId, companyName = null) => {
  try {
    logger.info(
      {
        providerId,
        ipo: companyName,
      },
      "[InvestorGain] Fetching Subscription",
    );

    const { data } = await axios.get(
      `${SUBSCRIPTION_URL}/${providerId}`,
    );

    const bidding =
      data?.data?.ipoBiddingData ?? [];

    if (bidding.length === 0) {
      logger.warn(
        {
          providerId,
          ipo: companyName,
        },
        "[InvestorGain] No Subscription Data",
      );

      return null;
    }

    /**
     * InvestorGain returns day-wise bidding data.
     *
     * The last entry is the latest available
     * subscription record.
     */
    const latestSubscription =
      bidding[bidding.length - 1];

    logger.info(
      {
        providerId,
        ipo: companyName,
        bidDate: latestSubscription.bid_date,
        overall: latestSubscription.total,
        qib: latestSubscription.qib,
        nii: latestSubscription.nii,
        retail: latestSubscription.rii,
      },
      "[InvestorGain] Latest Subscription",
    );

    return latestSubscription;

  } catch (err) {
    logger.warn(
      {
        providerId,
        ipo: companyName,
        err,
      },
      "[InvestorGain] Subscription Fetch Failed",
    );

    return null;
  }
};

/**
 * Fetch IPO list
 *
 * Used primarily for discovering new IPOs
 * and updating IPO metadata.
 */
const fetchIPOs = async () => {
  logger.info(
    {},
    "[InvestorGain] Fetching IPO List",
  );

  const { data } =
    await axios.get(IPO_LIST_URL);

  if (data.msg !== 1) {
    throw new Error(
      "Unable to fetch IPO list.",
    );
  }

  const result = [];

  for (const ipo of data.ipoList) {

    logger.info(
      {
        providerId: ipo.id,
        ipo: ipo.company_short_name,
        statusShort: ipo.ipo_status_short,
        openDate: ipo.issue_open_dt,
        closeDate: ipo.issue_end_dt,
      },
      "[InvestorGain] IPO Status",
    );

    let latestSubscription = null;

    /**
     * Fetch subscription when InvestorGain
     * considers the IPO active/closed/listed.
     */
    if (
      ["O", "CT", "C", "LP", "LN"]
        .includes(ipo.ipo_status_short)
    ) {
      latestSubscription =
        await fetchSubscription(
          ipo.id,
          ipo.company_short_name,
        );
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

  fetchSubscription,
};