const dateTime = require("../../../utils/dateTime");

const parseDate = (dateString) => {

    if (!dateString) {
        return null;
    }

    const [day, month, year] = dateString.split("-");

    return `${year}-${month}-${day}`;

};

const parseIssueSize = (issueSize) => {

    if (!issueSize) {
        return null;
    }

    return Number(
        issueSize
            .replace(/&#8377;/g, "")
            .replace(/₹/g, "")
            .replace(/Cr/gi, "")
            .replace(/,/g, "")
            .trim()
    );

};

const parseNumber = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    return Number(value);

};

const mapStatus = (status) => {

    switch (status) {

        case "U":
            return "UPCOMING";

        case "O":
            return "OPEN";

        case "C":
            return "CLOSED";

        case "LP":
        case "LN":
            return "LISTED";

        default:
            return "UPCOMING";

    }

};

const normalizeIPO = (rawIPO) => {

    const list = rawIPO.list;

    const subscription =
        rawIPO.subscription ?? {};

    return {

        providerId: list.id,

        companyName: list.company_short_name,

        symbol: null,

        isin: null,

        exchange: list.listing_at,

        category: "MAINBOARD",

        status: mapStatus(
            list.ipo_status_short
        ),

        openDate: parseDate(
            list.issue_open_dt
        ),

        closeDate: parseDate(
            list.issue_end_dt
        ),

        listingDate: null,

        priceBand: {

            lower: null,

            upper: null,

        },

        lotSize: null,

        issueSize: parseIssueSize(
            list.issue_size
        ),

        subscriptions: {

            overall: parseNumber(
                subscription.total
            ),

            retail: parseNumber(
                subscription.rii
            ),

            qib: parseNumber(
                subscription.qib
            ),

            nii: parseNumber(
                subscription.nii
            ),

            bnii: parseNumber(
                subscription.nii_big
            ),

            snii: parseNumber(
                subscription.nii_small
            ),

        },

        lastUpdatedAt:
            dateTime.now().toDate(),

    };

};

const normalizeIPOs = (ipos) => {

    return ipos.map(
        normalizeIPO
    );

};

module.exports = {

    normalizeIPO,

    normalizeIPOs,

};