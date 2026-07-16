const toNotificationDTO = (notification) => {

    if (!notification) {
        return null;
    }

    return {

        id: notification._id,

        userId: notification.userId,

        alertId: notification.alertId,

        ipoId: notification.ipoId,

        companyName: notification.companyName,

        subscriptionType: notification.subscriptionType,

        threshold: notification.threshold,

        triggerValue: notification.triggerValue,

        channel: notification.channel,

        whatsapp: {

            metaMessageId: notification.whatsapp.metaMessageId,

            status: notification.whatsapp.status,

            errorCode: notification.whatsapp.errorCode,

            errorReason: notification.whatsapp.errorReason,

            sentAt: notification.whatsapp.sentAt,

            deliveredAt: notification.whatsapp.deliveredAt,

            readAt: notification.whatsapp.readAt,

        },

        createdAt: notification.createdAt,

        updatedAt: notification.updatedAt,

    };

};

const toNotificationListDTO = (notifications) => {

    return notifications.map(toNotificationDTO);

};

module.exports = {
    toNotificationDTO,
    toNotificationListDTO,
};