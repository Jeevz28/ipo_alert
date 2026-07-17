require("dotenv").config();

const path = require("path");
const express = require("express");

const logger = require("./utils/logger");
const connectDB = require("./config/db");

const scheduler = require("./scheduler/scheduler");

const routes = require("./routes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

const PORT = process.env.PORT;

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
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
 * Serve Angular Production Build
 */
const angularDistPath = path.join(
    __dirname,
    "dist/app/browser"
);

app.use(express.static(angularDistPath));

app.get("/{*any}", (req, res) => {

    res.sendFile(
        path.join(
            angularDistPath,
            "index.csr.html"
        )
    );

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