/** @format */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const cartSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            quantity: { type: Number, required: true },
        },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

cartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
