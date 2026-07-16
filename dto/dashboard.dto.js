const toDashboardDTO = (data) => {

    return {

        openIpos: data.openIpos,

        upcomingIpos: data.upcomingIpos,

        activeAlerts: data.activeAlerts,

        notificationsSent: data.notificationsSent,

        deliveryRate: data.deliveryRate,

        readRate: data.readRate,

    };

};

module.exports = {
    toDashboardDTO,
};