const webhookService = require("../services/webhookService");
const logger = require("../utils/logger");

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

/**
 * GET
 * Meta Webhook Verification
 */
const verify = (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
        mode === "subscribe" &&
        token === VERIFY_TOKEN
    ) {

        logger.info(
            {},
            "[Webhook] Verification Successful"
        );

        return res.status(200).send(challenge);

    }

    logger.warn(
        {},
        "[Webhook] Verification Failed"
    );

    return res.sendStatus(403);

};

/**
 * POST
 * Receive Meta Webhook Events
 */
const receive = async (req, res) => {

    try {
        console.log(JSON.stringify(req));
        const entries = req.body?.entry ?? [];

        if (entries.length === 0) {

            logger.warn(
                {},
                "[Webhook] Empty Payload Received"
            );

            return res.sendStatus(200);

        }

        let processed = 0;

        for (const entry of entries) {

            const changes = entry.changes ?? [];

            for (const change of changes) {

                const statuses =
                    change.value?.statuses ?? [];

                for (const status of statuses) {

                    await webhookService.processStatus(status);

                    processed++;

                }

            }

        }

        logger.info(
            {
                processed,
            },
            "[Webhook] Processing Completed"
        );

        return res.sendStatus(200);

    } catch (err) {

        logger.error(
            {
                err,
            },
            "[Webhook] Processing Failed"
        );

        return res.sendStatus(500);

    }

};

module.exports = {
    verify,
    receive,
};