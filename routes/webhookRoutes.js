const express = require("express");

const router = express.Router();

const webhookController =
    require("../controllers/webhookController");

router.get(
    "/meta",
    webhookController.verify
);

router.post(
    "/meta",
    webhookController.receive
);

module.exports = router;