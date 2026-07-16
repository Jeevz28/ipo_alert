const subscriptionLabels = {
    overall: "Overall",
    retail: "Retail",
    qib: "QIB",
    nii: "NII",
};

const formatNumber = (value) => {
    return Number(value).toString();
};

const buildThresholdTemplate = (payload) => {

    return {

        messaging_product: "whatsapp",

        to: payload.user.whatsapp,

        type: "template",

        template: {

            name: process.env.WHATSAPP_TEMPLATE_THRESHOLD,

            language: {
                code: process.env.WHATSAPP_TEMPLATE_LANGUAGE,
            },

            components: [
                {
                    type: "body",

                    parameters: [
                        {
                            type: "text",
                            text: payload.ipo.companyName,
                        },
                        {
                            type: "text",
                            text: subscriptionLabels[payload.alert.subscriptionType],
                        },
                        {
                            type: "text",
                            text: formatNumber(payload.triggerValue),
                        },
                        {
                            type: "text",
                            text: formatNumber(payload.alert.threshold),
                        },
                    ],
                },
            ],
        },

    };

};

module.exports = {
    buildThresholdTemplate,
};