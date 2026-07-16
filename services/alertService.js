const Alert = require("../models/Alert");
const {
    toAlertDTO,
    toAlertListDTO,
} = require("../dto/alert.dto");

const createAlert = async (userId, body) => {

    const {
        ipoId,
        subscriptionType,
        threshold,
    } = body;

    const existingAlert = await Alert.findOne({
        userId,
        ipoId: ipoId || null,
        subscriptionType,
        threshold,
    });

    if (existingAlert) {
        throw new Error("Alert already exists.");
    }

    const alert = await Alert.create({
        userId,
        ipoId: ipoId || null,
        subscriptionType,
        threshold,
    });

    const populatedAlert = await Alert.findById(alert._id)
        .populate(
            "ipoId",
            "companyName status subscriptions"
        );

    return toAlertDTO(populatedAlert);

};

const getAlerts = async (userId) => {

    const alerts = await Alert.find({
        userId,
    })
        .populate(
            "ipoId",
            "companyName status subscriptions"
        )
        .sort({
            threshold: 1,
        });

    return toAlertListDTO(alerts);

};

const updateAlert = async (
    userId,
    alertId,
    body
) => {

    const alert = await Alert.findOne({
        _id: alertId,
        userId,
    });

    if (!alert) {
        throw new Error("Alert not found.");
    }

    const allowedFields = [
        "subscriptionType",
        "threshold",
        "enabled",
    ];

    allowedFields.forEach((field) => {

        if (body[field] !== undefined) {
            alert[field] = body[field];
        }

    });

    const duplicateAlert = await Alert.findOne({
        _id: {
            $ne: alertId,
        },
        userId,
        ipoId: alert.ipoId,
        subscriptionType: alert.subscriptionType,
        threshold: alert.threshold,
    });

    if (duplicateAlert) {
        throw new Error(
            "Another alert with the same subscription type and threshold already exists."
        );
    }

    await alert.save();

    const populatedAlert = await Alert.findById(alert._id)
        .populate(
            "ipoId",
            "companyName status subscriptions"
        );

    return toAlertDTO(populatedAlert);

};

const deleteAlert = async (
    userId,
    alertId
) => {

    const alert = await Alert.findOneAndDelete({
        _id: alertId,
        userId,
    });

    if (!alert) {
        throw new Error("Alert not found.");
    }

    return;

};

module.exports = {
    createAlert,
    getAlerts,
    updateAlert,
    deleteAlert,
};