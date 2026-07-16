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
  const ipo = await IPO.findOneAndUpdate(
    {
      providerId: ipoData.providerId,
    },
    {
      $set: {
        ...ipoData,
        lastUpdatedAt: dateTime.now().toDate(),
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

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
  getIPOById,
  getIPOByProviderId,
  deleteIPO,
};
