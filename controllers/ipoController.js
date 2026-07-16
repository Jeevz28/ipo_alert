const ipoService = require("../services/ipoService");
const logger = require("../utils/logger");

/**
 * Get all IPOs
 */
const getAll = async (req, res) => {

    try {

        const ipos = await ipoService.getAllIPOs();

        return res.status(200).json({
            success: true,
            data: ipos,
        });

    } catch (err) {

        logger.error(
            {
                err,
            },
            "[IPO] Get All Failed"
        );

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

/**
 * Get all open IPOs
 */
const getOpen = async (req, res) => {

    try {

        const ipos = await ipoService.getOpenIPOs();

        return res.status(200).json({
            success: true,
            data: ipos,
        });

    } catch (err) {

        logger.error(
            {
                err,
            },
            "[IPO] Get Open Failed"
        );

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

/**
 * Get IPO by ID
 */
const getById = async (req, res) => {

    try {

        const ipo = await ipoService.getIPOById(req.params.id);

        return res.status(200).json({
            success: true,
            data: ipo,
        });

    } catch (err) {

        logger.error(
            {
                err,
                ipoId: req.params.id,
            },
            "[IPO] Get By Id Failed"
        );

        return res.status(404).json({
            success: false,
            message: err.message,
        });

    }

};

module.exports = {
    getAll,
    getOpen,
    getById,
};