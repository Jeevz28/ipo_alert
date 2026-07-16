const Alert = require("../models/Alert");
const logger = require("../utils/logger");
const notificationService = require("./notificationService");
const whatsappService = require("./whatsapp/whatsappService");
const NotificationStatus = require("../constants/notificationStatus");

/**
 * Process all alerts for a single IPO
 */
const processIPO = async (ipo) => {

    logger.info(
        {
            ipo: ipo.companyName,
        },
        "[Alert Engine] Checking Alerts"
    );

    const alerts = await Alert.find({
        enabled: true,
        triggered: false,
        $or: [
            { ipoId: null },
            { ipoId: ipo.id },
        ],
    }).populate("userId");

    logger.info(
        {
            ipo: ipo.companyName,
            matchedAlerts: alerts.length,
        },
        "[Alert Engine] Alerts Matched"
    );

    for (const alert of alerts) {
        await processAlert(ipo, alert);
    }

};

/**
 * Process a single alert
 */
const processAlert = async (ipo, alert) => {

    try {

        const currentValue =
            ipo.subscriptions[alert.subscriptionType];

        // Threshold not reached
        if (currentValue < alert.threshold) {
            return;
        }

        // Skip if already notified
        const alreadySent =
            await notificationService.hasNotification(
                alert.userId._id,
                alert._id,
                ipo.id
            );

        if (alreadySent) {

            logger.info(
                {
                    ipo: ipo.companyName,
                    userId: alert.userId._id,
                },
                "[Alert Engine] Notification Already Sent"
            );

            return;

        }

        logger.info(
            {
                ipo: ipo.companyName,
                subscriptionType: alert.subscriptionType,
                threshold: alert.threshold,
                triggerValue: currentValue,
                userId: alert.userId._id,
            },
            "[Alert Engine] Alert Triggered"
        );

        const payload = {

            user: {
                id: alert.userId._id,
                whatsapp: alert.userId.whatsapp,
            },

            ipo: {
                id: ipo.id,
                companyName: ipo.companyName,
            },

            alert: {
                id: alert._id,
                subscriptionType: alert.subscriptionType,
                threshold: alert.threshold,
            },

            triggerValue: currentValue,

        };

        const result =
            await whatsappService.sendAlert(payload);

        if (!result.success) {

            logger.error(
                {
                    userId: alert.userId._id,
                    ipo: ipo.companyName,
                },
                "[Alert Engine] WhatsApp Notification Failed"
            );

            return;

        }

        await notificationService.createNotification({

            userId: alert.userId._id,

            alertId: alert._id,

            ipoId: ipo.id,

            companyName: ipo.companyName,

            subscriptionType: alert.subscriptionType,

            threshold: alert.threshold,

            triggerValue: currentValue,

            status: NotificationStatus.SENT,

            metaMessageId: result.metaMessageId,

        });

// Mark as triggered only for IPO-specific alerts.
// Global alerts (ipoId = null) should continue
// monitoring future IPOs.



if (alert.ipoId) {

    await Alert.updateOne(
        {
            _id: alert._id,
        },
        {
            $set: {
                triggered: true,
                triggeredAt: new Date(),
            },
        }
    );

}

        logger.info(
            {
                userId: alert.userId._id,
                ipo: ipo.companyName,
                metaMessageId: result.metaMessageId,
            },
            "[Alert Engine] WhatsApp Notification Sent"
        );

    } catch (err) {

        logger.error(
            {
                err,
                ipo: ipo.companyName,
                userId: alert.userId?._id,
            },
            "[Alert Engine] Failed To Process Alert"
        );

    }

};

module.exports = {
    processIPO,
};