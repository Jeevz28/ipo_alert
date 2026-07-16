const express = require("express");
const { param } = require("express-validator");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validation");
const ipoController = require("../controllers/ipoController");

// Protect all IPO routes
router.use(authMiddleware);

/**
 * GET /api/ipos
 * Get all IPOs
 */
router.get(
    "/",
    ipoController.getAll
);

/**
 * GET /api/ipos/open
 * Get only open IPOs
 */
router.get(
    "/open",
    ipoController.getOpen
);

/**
 * GET /api/ipos/:id
 * Get IPO by MongoDB Id
 */
router.get(
    "/:id",
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid IPO Id"),
    ],
    validate,
    ipoController.getById
);

module.exports = router;