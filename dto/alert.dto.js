const toAlertDTO = (alert) => {

    if (!alert) {
        return null;
    }

    const ipo =
        alert.ipoId && typeof alert.ipoId === "object"
            ? {
                  id: alert.ipoId._id.toString(),
                  companyName: alert.ipoId.companyName,
                  status: alert.ipoId.status,
                  subscriptions: alert.ipoId.subscriptions,
              }
            : null;

    return {

        id: alert._id.toString(),

        ipo,

        subscriptionType: alert.subscriptionType,

        threshold: alert.threshold,

        enabled: alert.enabled,

        triggered: alert.triggered,

        triggeredAt: alert.triggeredAt,

        createdAt: alert.createdAt,

        updatedAt: alert.updatedAt,

    };

};

const toAlertListDTO = (alerts) => {

    return alerts.map(toAlertDTO);

};

module.exports = {

    toAlertDTO,

    toAlertListDTO,

};