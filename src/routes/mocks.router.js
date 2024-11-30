/** @format */

const express = require("express");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Pet = require("../models/Pet");
const router = express.Router();

router.get("/mockingpets", async (req, res) => {
    try {
        const pets = Array.from({ length: 10 }).map(() => ({
            name: faker.person.firstName(),
            age: faker.number.int({ min: 1, max: 15 }),
            type: faker.helpers.arrayElement([
                "dog",
                "cat",
                "rabbit",
                "parrot",
                "hamster",
            ]),
            owner: faker.person.fullName(),
        }));
        res.json({ status: "success", payload: pets });
    } catch (error) {
        console.error("Error al generar mascotas:", error);
        res.status(500).json({ error: "Error al generar mascotas" });
    }
});

router.get("/mockingusers", async (req, res) => {
    try {
        const users = Array.from({ length: 50 }).map(() => {
            const passwordHash = bcrypt.hashSync("coder123", 10);
            return {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: passwordHash,
                role: faker.helpers.arrayElement(["user", "admin"]),
                pets: [],
            };
        });
        res.json({ status: "success", payload: users });
    } catch (error) {
        res.status(500).json({ error: "Error al generar usuarios" });
    }
});

router.post("/generateData", async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        if (users < 0 || pets < 0) {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }

        const userPromises = Array.from({ length: users }).map(async () => {
            const passwordHash = bcrypt.hashSync("coder123", 10);
            const user = new User({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: passwordHash,
                role: faker.helpers.arrayElement(["user", "admin"]),
                pets: [],
            });
            return user.save();
        });

        const petPromises = Array.from({ length: pets }).map(async () => {
            const pet = new Pet({
                name: faker.person.firstName(),
                age: faker.number.int({ min: 1, max: 15 }),
                type: faker.helpers.arrayElement([
                    "dog",
                    "cat",
                    "rabbit",
                    "parrot",
                    "hamster",
                ]),
                owner: faker.person.fullName(),
            });
            return pet.save();
        });

        await Promise.all([...userPromises, ...petPromises]);

        res.json({
            status: "success",
            message: `Se han insertado ${users} usuarios y ${pets} mascotas en la base de datos.`,
        });
    } catch (error) {
        console.error("Error al generar datos:", error.message);
        res.status(500).json({ error: "Error al generar datos" });
    }
});

module.exports = router;
