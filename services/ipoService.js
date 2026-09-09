const IPO = require("../models/IPO");
const dateTime = require("../utils/dateTime");

const { toIPODTO, toIPOListDTO } = require("../dto/ipo.dto");

/**
 * Create IPO
 * Internal use only
 */
const createIPO = async (ipoData) => {

  const existingIPO = await IPO.findOne({
    providerId: ipoData.providerId,
  });

  if (existingIPO) {
    throw new Error("IPO already exists.");
  }

  const ipo = await IPO.create(ipoData);

  return toIPODTO(ipo);
};

/**
 * Insert or Update IPO
 * Used by Scheduler
 */
const upsertIPO = async (ipoData) => {

  const existingIPO = await IPO.findOne({
    providerId: ipoData.providerId,
  });

  /**
   * Existing IPO
   *
   * Preserve existing required fields when the provider
   * sends null/empty values.
   */
  if (existingIPO) {

    const updateData = {
      ...ipoData,
      lastUpdatedAt: dateTime.now().toDate(),
    };

    /**
     * Do not overwrite valid existing dates with null.
     */
    if (!ipoData.openDate) {
      delete updateData.openDate;
    }

    if (!ipoData.closeDate) {
      delete updateData.closeDate;
    }

    /**
     * Do not overwrite issueSize with invalid/null data.
     */
    if (
      ipoData.issueSize === null ||
      ipoData.issueSize === undefined ||
      !Number.isFinite(ipoData.issueSize)
    ) {
      delete updateData.issueSize;
    }

    const ipo = await IPO.findOneAndUpdate(
      {
        providerId: ipoData.providerId,
      },
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return toIPODTO(ipo);
  }

  /**
   * New IPO
   *
   * MongoDB requires openDate and closeDate.
   * Do not create an incomplete IPO.
   *
   * The scheduler will log and skip this IPO,
   * allowing the remaining IPOs to continue.
   */
  if (!ipoData.openDate || !ipoData.closeDate) {

    throw new Error(
      `Cannot create IPO "${ipoData.companyName}" because openDate or closeDate is missing.`,
    );

  }

  /**
   * Prevent invalid issueSize values such as NaN.
   */
  const createData = {
    ...ipoData,
    lastUpdatedAt: dateTime.now().toDate(),
  };

  if (
    createData.issueSize === null ||
    createData.issueSize === undefined ||
    !Number.isFinite(createData.issueSize)
  ) {
    delete createData.issueSize;
  }

  const ipo = await IPO.create(createData);

  return toIPODTO(ipo);
};

/**
 * Get All IPOs
 */
const getAllIPOs = async () => {

  const ipos = await IPO.find().sort({
    openDate: -1,
  });

  return toIPOListDTO(ipos);
};


/**
 * Get IPOs Currently Within Subscription Window
 *
 * Used by Scheduler to refresh subscription data
 * even when the IPO is no longer returned by the
 * InvestorGain IPO list endpoint.
 */
const getActiveIPOs = async () => {

  const today = dateTime.now().format("YYYY-MM-DD");

  const ipos = await IPO.find({
    openDate: {
      $lte: today,
    },
    closeDate: {
      $gte: today,
    },
  }).sort({
    closeDate: 1,
  });

  return ipos;
};


/**
 * Update IPO Subscription
 *
 * Used by Scheduler when refreshing an existing
 * active IPO directly from the provider.
 */
const updateSubscription = async (
  ipoId,
  subscription,
) => {

  if (!subscription) {
    return null;
  }

  const ipo =
    await IPO.findByIdAndUpdate(
      ipoId,
      {
        $set: {
            status: "OPEN",

            "subscriptions.overall": Number(subscription.total) || 0,
            "subscriptions.retail": Number(subscription.rii) || 0,
            "subscriptions.qib": Number(subscription.qib) || 0,
            "subscriptions.nii": Number(subscription.nii) || 0,
            "subscriptions.bnii": Number(subscription.nii_big) || 0,
            "subscriptions.snii": Number(subscription.nii_small) || 0,

            lastUpdatedAt: dateTime.now().toDate(),
        },
    },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

  if (!ipo) {
    throw new Error(
      "IPO not found while updating subscription.",
    );
  }

  return toIPODTO(ipo);
};

/**
 * Get Open IPOs
 */
const getOpenIPOs = async () => {

  const ipos = await IPO.find({
    status: "OPEN",
  }).sort({
    closeDate: 1,
  });

  return toIPOListDTO(ipos);
};

/**
 * Get IPO By Mongo Id
 */
const getIPOById = async (ipoId) => {

  const ipo = await IPO.findById(ipoId);

  if (!ipo) {
    throw new Error("IPO not found.");
  }

  return toIPODTO(ipo);
};

/**
 * Get IPO By Provider Id
 * Used by Scheduler
 */
const getIPOByProviderId = async (providerId) => {

  const ipo = await IPO.findOne({
    providerId,
  });

  if (!ipo) {
    return null;
  }

  return toIPODTO(ipo);
};

/**
 * Delete IPO
 * Internal/Admin only
 */
const deleteIPO = async (ipoId) => {

  const ipo = await IPO.findByIdAndDelete(ipoId);

  if (!ipo) {
    throw new Error("IPO not found.");
  }

};



module.exports = {
  createIPO,
  upsertIPO,
  getAllIPOs,
  getOpenIPOs,
  getActiveIPOs,
  updateSubscription,
  getIPOById,
  getIPOByProviderId,
  deleteIPO,
};