const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res) => {

    try {

        const dashboard =
            await dashboardService.getDashboard(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: dashboard,
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

module.exports = {
    getDashboard,
};