/** @format */

const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    total: { type: Number, required: true },
    code: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
