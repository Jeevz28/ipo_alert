const toIPODTO = (ipo) => {
  if (!ipo) {
    return null;
  }

  return {
    id: ipo._id.toString(),

    providerId: ipo.providerId,
    
    companyName: ipo.companyName,

    symbol: ipo.symbol,

    isin: ipo.isin,

    exchange: ipo.exchange,

    category: ipo.category,

    status: ipo.status,

    openDate: ipo.openDate,

    closeDate: ipo.closeDate,

    listingDate: ipo.listingDate,

    priceBand: {
      lower: ipo.priceBand.lower,
      upper: ipo.priceBand.upper,
    },

    lotSize: ipo.lotSize,

    issueSize: ipo.issueSize,

    subscriptions: {
      overall: ipo.subscriptions.overall,
      retail: ipo.subscriptions.retail,
      qib: ipo.subscriptions.qib,
      nii: ipo.subscriptions.nii,
      bnii: ipo.subscriptions.bnii,
      snii: ipo.subscriptions.snii,
    },

    lastUpdatedAt: ipo.lastUpdatedAt,

    createdAt: ipo.createdAt,

    updatedAt: ipo.updatedAt,
  };
};

const toIPOListDTO = (ipos) => {
  return ipos.map(toIPODTO);
};

module.exports = {
  toIPODTO,
  toIPOListDTO,
};
