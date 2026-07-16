const pino = require("pino");

const isDevelopment =
    process.env.NODE_ENV !== "production";

const logger = pino({

    level: process.env.LOG_LEVEL || "info",

    transport: isDevelopment
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
                  ignore: "pid,hostname",
              },
          }
        : undefined,

});

module.exports = logger;