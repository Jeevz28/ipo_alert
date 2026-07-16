const alertService = require("../services/alertService");

const create = async (req, res) => {

    try {

        const alert = await alertService.createAlert(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Alert created successfully.",
            data: alert,
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};

const getAll = async (req, res) => {

    try {

        const alerts = await alertService.getAlerts(
            req.user.id
        );

        return res.json({
            success: true,
            data: alerts,
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};

const update = async (req, res) => {

    try {

        const alert = await alertService.updateAlert(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.json({
            success: true,
            message: "Alert updated.",
            data: alert,
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};

const remove = async (req, res) => {

    try {

        await alertService.deleteAlert(
            req.user.id,
            req.params.id
        );

        return res.json({
            success: true,
            message: "Alert deleted.",
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};

module.exports = {
    create,
    getAll,
    update,
    remove,
};