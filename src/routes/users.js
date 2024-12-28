/** @format */
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: "Crear un nuevo usuario"
 *     description: "Crea un nuevo usuario en el sistema. Si el email ya existe, se devuelve un error."
 *     operationId: "createUser"
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Datos del usuario a crear"
 *         required: true
 *         schema:
 *           type: "object"
 *           required:
 *             - first_name
 *             - last_name
 *             - email
 *             - age
 *             - password
 *           properties:
 *             first_name:
 *               type: "string"
 *               example: "Juan"
 *             last_name:
 *               type: "string"
 *               example: "Pérez"
 *             email:
 *               type: "string"
 *               example: "juan.perez@example.com"
 *             age:
 *               type: "integer"
 *               example: 30
 *             password:
 *               type: "string"
 *               example: "password123"
 *             cart:
 *               type: "string"
 *               example: "cartId123"
 *             role:
 *               type: "string"
 *               example: "user"
 *     responses:
 *       201:
 *         description: "Usuario creado exitosamente"
 *         schema:
 *           type: "object"
 *           properties:
 *             message:
 *               type: "string"
 *               example: "Usuario creado exitosamente"
 *       400:
 *         description: "El usuario ya existe"
 *         schema:
 *           type: "object"
 *           properties:
 *             message:
 *               type: "string"
 *               example: "El usuario ya existe"
 *       500:
 *         description: "Error en el servidor"
 *         schema:
 *           type: "object"
 *           properties:
 *             message:
 *               type: "string"
 *               example: "Error en el servidor"
 *             error:
 *               type: "string"
 *               example: "Error details"
 */

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
