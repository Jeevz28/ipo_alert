const mongoose = require("mongoose");

const NotificationStatus = require("../constants/notificationStatus");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        alertId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alert",
            required: true,
            index: true,
        },

        ipoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IPO",
            required: true,
            index: true,
        },

        companyName: {
            type: String,
            required: true,
        },

        subscriptionType: {
            type: String,
            required: true,
        },

        threshold: {
            type: Number,
            required: true,
        },

        triggerValue: {
            type: Number,
            required: true,
        },

        channel: {
            type: String,
            enum: ["WHATSAPP"],
            default: "WHATSAPP",
        },

        whatsapp: {

            metaMessageId: {
                type: String,
                default: null,
                index: true,
            },

            status: {
                type: Number,
                enum: Object.values(NotificationStatus),
                default: NotificationStatus.SENT,
                index: true,
            },

            errorCode: {
                type: Number,
                default: null,
            },

            errorReason: {
                type: String,
                default: null,
            },

            sentAt: {
                type: Date,
                default: null,
            },

            deliveredAt: {
                type: Date,
                default: null,
            },

            readAt: {
                type: Date,
                default: null,
            },

        },

    },
    {
        timestamps: true,
    }
);

notificationSchema.index({
    userId: 1,
    "whatsapp.sentAt": -1,
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);