/** @format */

const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    type: { type: String, required: true },
    owner: { type: String, required: true },
});

const Pet = mongoose.model("Pet", petSchema);
module.exports = Pet;
