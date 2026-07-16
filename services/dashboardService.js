const IPO = require("../models/IPO");
const Alert = require("../models/Alert");
const Notification = require("../models/Notification");

const NotificationStatus = require("../constants/notificationStatus");

const {
    toDashboardDTO,
} = require("../dto/dashboard.dto");

const getDashboard = async (userId) => {

    const [

        openIpos,

        upcomingIpos,

        activeAlerts,

        notificationsSent,

        deliveredCount,

        readCount,

    ] = await Promise.all([

        IPO.countDocuments({
            status: "OPEN",
        }),

        IPO.countDocuments({
            status: "UPCOMING",
        }),

        Alert.countDocuments({
            userId,
            enabled: true,
            triggered: false,
        }),

        Notification.countDocuments({
            userId,
        }),

        Notification.countDocuments({
            userId,
            "whatsapp.status": {
                $in: [
                    NotificationStatus.DELIVERED,
                    NotificationStatus.READ,
                ],
            },
        }),

        Notification.countDocuments({
            userId,
            "whatsapp.status":
                NotificationStatus.READ,
        }),

    ]);

    const deliveryRate =
        notificationsSent === 0
            ? 0
            : Number(
                  (
                      (deliveredCount /
                          notificationsSent) *
                      100
                  ).toFixed(2)
              );

    const readRate =
        deliveredCount === 0
            ? 0
            : Number(
                  (
                      (readCount /
                          deliveredCount) *
                      100
                  ).toFixed(2)
              );

    return toDashboardDTO({

        openIpos,

        upcomingIpos,

        activeAlerts,

        notificationsSent,

        deliveryRate,

        readRate,

    });

};

module.exports = {
    getDashboard,
};