/** @format */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conexión exitosa a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
