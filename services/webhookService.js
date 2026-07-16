const Notification = require("../models/Notification");

const NotificationStatus = require("../constants/notificationStatus");
const MetaWebhookStatus = require("../constants/metaWebhookStatus");

const logger = require("../utils/logger");
const dateTime = require("../utils/dateTime");

const processStatus = async (statusData) => {

    try {

        const {
            id: messageId,
            status,
            timestamp,
            errors,
        } = statusData;

        const error = errors?.[0];

        const eventTime = timestamp
            ? new Date(Number(timestamp) * 1000)
            : dateTime.now().toDate();

        const notification = await Notification.findOne({
            "whatsapp.metaMessageId": messageId,
        });

        if (!notification) {

            logger.warn(
                {
                    messageId,
                    status,
                },
                "[Webhook] Notification Not Found"
            );

            return;

        }

        const update = {};

        switch (status) {

            case MetaWebhookStatus.SENT:

                if (
                    notification.whatsapp.status >=
                    NotificationStatus.DELIVERED
                ) {
                    return;
                }

                update["whatsapp.status"] =
                    NotificationStatus.SENT;

                update["whatsapp.sentAt"] =
                    eventTime;

                break;

            case MetaWebhookStatus.DELIVERED:

                if (
                    notification.whatsapp.status >=
                    NotificationStatus.READ
                ) {
                    return;
                }

                update["whatsapp.status"] =
                    NotificationStatus.DELIVERED;

                update["whatsapp.deliveredAt"] =
                    eventTime;

                break;

            case MetaWebhookStatus.READ:

                if (
                    notification.whatsapp.status ===
                    NotificationStatus.READ
                ) {
                    return;
                }

                update["whatsapp.status"] =
                    NotificationStatus.READ;

                update["whatsapp.readAt"] =
                    eventTime;

                // If Meta skipped DELIVERED,
                // READ implies DELIVERED.
                update["whatsapp.deliveredAt"] =
                    notification.whatsapp.deliveredAt ??
                    eventTime;

                break;

            case MetaWebhookStatus.FAILED:

                if (
                    notification.whatsapp.status ===
                    NotificationStatus.READ
                ) {
                    return;
                }

                update["whatsapp.status"] =
                    NotificationStatus.FAILED;

                update["whatsapp.errorCode"] =
                    error?.code ?? null;

                update["whatsapp.errorReason"] =
                    error?.title ??
                    error?.message ??
                    null;

                break;

            default:

                logger.warn(
                    {
                        messageId,
                        status,
                    },
                    "[Webhook] Unknown Status"
                );

                return;

        }

        const updatedNotification =
            await Notification.findByIdAndUpdate(
                notification._id,
                {
                    $set: update,
                },
                {
                    new: true,
                }
            );

        logger.info(
            {
                notificationId: updatedNotification._id,
                messageId,
                status:
                    updatedNotification.whatsapp.status,
            },
            "[Webhook] Notification Updated"
        );

    } catch (err) {

        logger.error(
            {
                err,
                statusData,
            },
            "[Webhook] Processing Failed"
        );

    }

};

module.exports = {
    processStatus,
};