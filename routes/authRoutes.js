const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validation");

const router = express.Router();

/**
 * Register User
 */
router.post(
    "/register",
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required"),

        body("whatsapp")
            .trim()
            .notEmpty()
            .withMessage("WhatsApp number is required")
            .isLength({ min: 10, max: 15 })
            .withMessage("Invalid WhatsApp number"),

        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
    ],
    validate,
    authController.register
);

/**
 * Login User
 */
router.post(
    "/login",
    [
        body("whatsapp")
            .trim()
            .notEmpty()
            .withMessage("WhatsApp number is required"),

        body("password")
            .notEmpty()
            .withMessage("Password is required"),
    ],
    validate,
    authController.login
);

/**
 * Get Logged-in User
 */
router.get(
    "/me",
    authMiddleware,
    authController.me
);

module.exports = router;