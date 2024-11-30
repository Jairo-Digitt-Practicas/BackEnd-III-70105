/** @format */

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const hashedPassword = bcrypt.hashSync(password);
        console.log("Contraseña encriptada en el registro:", hashedPassword);

        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            age: req.body.age,
            password: hashedPassword,
            cart: req.body.cart,
            role: req.body.role || "user",
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
});

module.exports = router;
