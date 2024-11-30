/** @format */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    console.log("Datos recibidos en la solicitud:", email, password);

    if (!email || !password) {
        console.log("Email o contraseña no enviados");
        return res
            .status(400)
            .json({ message: "Email y contraseña son obligatorios" });
    }

    try {
        console.log("Buscando usuario en la base de datos...");
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Usuario no encontrado");
            return res
                .status(401)
                .json({ message: "Usuario o contraseña incorrectos" });
        }

        console.log("Usuario encontrado en la base de datos:", user);

        const isMatch = bcrypt.compareSync(password, user.password);
        console.log("Resultado de la comparación de contraseñas:", isMatch);

        if (!isMatch) {
            console.log("Contraseña incorrecta");
            return res
                .status(401)
                .json({ message: "Usuario o contraseña incorrectos" });
        }

        console.log("Contraseña correcta, generando token...");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("jwt", token, { httpOnly: true });
        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        console.error("Error durante el proceso de login:", error);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
});

module.exports = router;
