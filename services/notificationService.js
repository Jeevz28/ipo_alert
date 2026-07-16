const Notification = require("../models/Notification");

const {
    toNotificationDTO,
    toNotificationListDTO,
} = require("../dto/notification.dto");

const NotificationStatus = require("../constants/notificationStatus");
const dateTime = require("../utils/dateTime");
const logger = require("../utils/logger");

/**
 * Check whether notification already exists
 */
const hasNotification = async (userId, alertId, ipoId) => {

    try {

        const notification = await Notification.findOne({
            userId,
            alertId,
            ipoId,
        });

        return !!notification;

    } catch (err) {

        logger.error(
            {
                err,
                userId,
                alertId,
                ipoId,
            },
            "[Notification] Duplicate Check Failed"
        );

        throw err;

    }

};

/**
 * Create notification history
 */
const createNotification = async (data) => {

    try {

        const notification = await Notification.create({

            userId: data.userId,

            alertId: data.alertId,

            ipoId: data.ipoId,

            companyName: data.companyName,

            subscriptionType: data.subscriptionType,

            threshold: data.threshold,

            triggerValue: data.triggerValue,

            channel: "WHATSAPP",

            whatsapp: {

                metaMessageId: data.metaMessageId ?? null,

                status: data.status ?? NotificationStatus.SENT,

                errorCode: null,

                errorReason: null,

                sentAt: dateTime.now().toDate(),

                deliveredAt: null,

                readAt: null,

            },

        });

        logger.info(
            {
                notificationId: notification._id,
                userId: notification.userId,
                ipoId: notification.ipoId,
                status: notification.whatsapp.status,
            },
            "[Notification] Saved"
        );

        return toNotificationDTO(notification);

    } catch (err) {

        logger.error(
            {
                err,
                userId: data.userId,
                ipoId: data.ipoId,
            },
            "[Notification] Save Failed"
        );

        throw err;

    }

};

/**
 * Get notifications for a user
 */
const getUserNotifications = async (userId) => {

    try {

        const notifications = await Notification.find({
            userId,
        }).sort({
            "whatsapp.sentAt": -1,
        });

        logger.info(
            {
                userId,
                total: notifications.length,
            },
            "[Notification] Retrieved"
        );

        return toNotificationListDTO(notifications);

    } catch (err) {

        logger.error(
            {
                err,
                userId,
            },
            "[Notification] Retrieval Failed"
        );

        throw err;

    }

};

module.exports = {
    hasNotification,
    createNotification,
    getUserNotifications,
};