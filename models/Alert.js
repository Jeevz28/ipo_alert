const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // null = Global Alert (Any Mainboard IPO)
        // ObjectId = Specific IPO
        ipoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IPO",
            default: null,
            index: true,
        },

        subscriptionType: {
            type: String,
            enum: [
                "overall",
                "retail",
                "qib",
                "nii",
            ],
            required: true,
        },

        threshold: {
            type: Number,
            required: true,
            min: 1,
        },

        enabled: {
            type: Boolean,
            default: true,
        },

        triggered: {
            type: Boolean,
            default: false,
            index: true,
        },

        triggeredAt: {
            type: Date,
            default: null,
        },

    },
    {
        timestamps: true,
    }
);

// Prevent duplicate alerts
alertSchema.index(
    {
        userId: 1,
        ipoId: 1,
        subscriptionType: 1,
        threshold: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Alert", alertSchema);