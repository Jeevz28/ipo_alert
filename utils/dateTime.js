const dayjs = require("dayjs");

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const INDIA_TIMEZONE = "Asia/Kolkata";

const now = () => {
    return dayjs().tz(INDIA_TIMEZONE);
};

const today = () => {
    return now().startOf("day");
};

const toIST = (date) => {
    return dayjs(date).tz(INDIA_TIMEZONE);
};

const format = (date, formatString = "DD-MM-YYYY HH:mm:ss") => {
    return dayjs(date)
        .tz(INDIA_TIMEZONE)
        .format(formatString);
};

module.exports = {
    INDIA_TIMEZONE,
    now,
    today,
    toIST,
    format,
};