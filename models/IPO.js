const mongoose = require("mongoose");

const ipoSchema = new mongoose.Schema(
  {
    providerId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

symbol: {
    type: String,
    uppercase: true,
    trim: true,
    default: null,
},

    isin: {
      type: String,
      uppercase: true,
      trim: true,
      default: null,
    },

    exchange: {
      type: String,
      enum: ["NSE", "BSE", "BSE, NSE"],
      required: true,
    },

    category: {
      type: String,
      enum: ["MAINBOARD"],
      default: "MAINBOARD",
    },

    status: {
      type: String,
      enum: ["UPCOMING", "OPEN", "CLOSED", "LISTED"],
      default: "UPCOMING",
      index: true,
    },

    openDate: {
      type: String,
      required: true,
    },

    closeDate: {
      type: String,
      required: true,
    },

    listingDate: {
      type: String,
      default: null,
    },

    priceBand: {
      lower: {
        type: Number,
        default: null,
      },

      upper: {
        type: Number,
        default: null,
      },
    },

    lotSize: {
      type: Number,
      default: null,
    },

    issueSize: {
      type: Number,
      default: null,
    },

    subscriptions: {
      overall: {
        type: Number,
        default: 0,
      },

      retail: {
        type: Number,
        default: 0,
      },

      qib: {
        type: Number,
        default: 0,
      },

      nii: {
        type: Number,
        default: 0,
      },

      bnii: {
        type: Number,
        default: 0,
      },

      snii: {
        type: Number,
        default: 0,
      },
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("IPO", ipoSchema);
