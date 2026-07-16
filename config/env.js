const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.join(__dirname, "../.env")
});

//console.log("PORT:", process.env.PORT);
//console.log("MONGO_URI:", process.env.MONGO_URI);