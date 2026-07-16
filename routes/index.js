const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/alerts", require("./alertRoutes"));
router.use("/ipos", require("./ipoRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));

module.exports = router;