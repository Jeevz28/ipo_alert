require("dotenv").config();

const dns = require("dns");
const express = require("express");

const logger = require("./utils/logger");
const connectDB = require("./config/db");

const scheduler = require("./scheduler/scheduler");

const routes = require("./routes");
const webhookRoutes = require("./routes/webhookRoutes");

dns.setServers([
    "10.92.24.210",
    "8.8.8.8",
    "1.1.1.1",
]);

const app = express();

const PORT = process.env.PORT;

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
app.use("/api", routes);
app.use("/webhooks", webhookRoutes);

/**
 * Health Check
 */
app.get("/api/health", (req, res) => {

    return res.status(200).json({

        success: true,

        message: "IPO Alert API is running",

        timestamp: new Date(),

    });

});

/**
 * Bootstrap Application
 */
const startServer = async () => {

    try {

        // Connect MongoDB first
        await connectDB();

        // Start Express Server
        app.listen(PORT, () => {

            logger.info(
                {
                    port: PORT,
                },
                "[Server] Running"
            );

            // Start Scheduler only after MongoDB is connected
            scheduler.start();

        });

    } catch (err) {

        logger.fatal(
            {
                err,
            },
            "[Server] Startup Failed"
        );

        process.exit(1);

    }

};

startServer();