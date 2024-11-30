/** @format */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
