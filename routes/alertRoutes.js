const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validation");

const alertController = require("../controllers/alertController");

// Protect all alert routes
router.use(authMiddleware);

/**
 * Create Alert
 */
router.post(
    "/",
    [
        body("ipoId")
            .optional({ nullable: true })
            .isMongoId()
            .withMessage("Invalid IPO Id"),

        body("subscriptionType")
            .notEmpty()
            .withMessage("Subscription type is required")
            .isIn(["overall", "retail", "qib", "nii"])
            .withMessage("Invalid subscription type"),

        body("threshold")
            .notEmpty()
            .withMessage("Threshold is required")
            .isFloat({ gt: 0 })
            .withMessage("Threshold must be greater than 0"),
    ],
    validate,
    alertController.create
);

/**
 * Get My Alerts
 */
router.get(
    "/",
    alertController.getAll
);

/**
 * Update Alert
 */
router.put(
    "/:id",
    [
        body("ipoId")
            .optional({ nullable: true })
            .isMongoId()
            .withMessage("Invalid IPO Id"),

        body("subscriptionType")
            .optional()
            .isIn(["overall", "retail", "qib", "nii"])
            .withMessage("Invalid subscription type"),

        body("threshold")
            .optional()
            .isFloat({ gt: 0 })
            .withMessage("Threshold must be greater than 0"),

        body("enabled")
            .optional()
            .isBoolean()
            .withMessage("Enabled must be true or false"),
    ],
    validate,
    alertController.update
);

/**
 * Delete Alert
 */
router.delete(
    "/:id",
    alertController.remove
);

module.exports = router;