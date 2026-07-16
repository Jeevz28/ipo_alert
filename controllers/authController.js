const authService = require("../services/authService");
const { toUserDTO } = require("../dto/user.dto");
const logger = require("../utils/logger");

const register = async (req, res) => {

    try {

        const user = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: toUserDTO(user),
        });

    } catch (err) {

        logger.error(
            {
                err,
                whatsapp: req.body?.whatsapp,
            },
            "[Auth] Register Failed"
        );

        return res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};

const login = async (req, res) => {

    try {

        const data = await authService.login(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data,
        });

    } catch (err) {

        logger.error(
            {
                err,
                whatsapp: req.body?.whatsapp,
            },
            "[Auth] Login Failed"
        );

        return res.status(401).json({
            success: false,
            message: err.message,
        });

    }

};

const me = async (req, res) => {

    try {

        const user = await authService.getCurrentUser(req.user.id);

        return res.status(200).json({
            success: true,
            data: user,
        });

    } catch (err) {

        logger.error(
            {
                err,
                userId: req.user?.id,
            },
            "[Auth] Current User Failed"
        );

        return res.status(404).json({
            success: false,
            message: err.message,
        });

    }

};

module.exports = {
    register,
    login,
    me,
};