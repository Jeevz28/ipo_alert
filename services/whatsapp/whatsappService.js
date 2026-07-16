const axios = require("axios");
const logger = require("../../utils/logger");

const { buildThresholdTemplate } = require("./templateBuilder");

const sendAlert = async (payload) => {
  try {
    const body = buildThresholdTemplate(payload);

    logger.info(
      {
        recipient: payload.user.whatsapp,
        ipo: payload.ipo.companyName,
      },
      "[WhatsApp] Sending",
    );

    const response = await axios.post(
      `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,

      body,

      {
        timeout: 10000,

        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,

          "Content-Type": "application/json",
        },
      },
    );

    const messageId = response.data.messages[0].id;

    logger.info(
      {
        recipient: payload.user.whatsapp,
        ipo: payload.ipo.companyName,
        metaMessageId: messageId,
      },
      "[WhatsApp] Sent",
    );

    return {
      success: true,

      metaMessageId: messageId,
    };
  } catch (err) {
    logger.error(
      {
        recipient: payload.user.whatsapp,
        ipo: payload.ipo.companyName,

        httpStatus: err.response?.status,

        metaCode: err.response?.data?.error?.code,

        metaMessage: err.response?.data?.error?.message,

        err,
      },
      "[WhatsApp] Failed",
    );

    return {
      success: false,

      metaMessageId: null,
    };
  }
};

module.exports = {
  sendAlert,
};
