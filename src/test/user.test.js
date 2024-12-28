/** @format */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const userRouter = require("../routes/users");

const app = express();
app.use(express.json());
app.use("/users", userRouter);

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/testdb`;
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /users", () => {
    it("debería crear un nuevo usuario", async () => {
        const newUser = {
            first_name: "Juan",
            last_name: "Pérez",
            email: "juan.perez@example.com",
            age: 30,
            password: "password123",
        };

        const response = await request(app).post("/users").send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Usuario creado exitosamente");

        const user = await User.findOne({ email: newUser.email });
        expect(user).toBeTruthy();
        expect(user.first_name).toBe(newUser.first_name);
    });

    it("debería devolver un error si el usuario ya existe", async () => {
        const existingUser = new User({
            first_name: "Juan",
            last_name: "Pérez",
            email: "juan.perez@example.com",
            age: 30,
            password: "password123",
        });

        await existingUser.save();

        const newUser = {
            first_name: "Juan",
            last_name: "Pérez",
            email: "juan.perez@example.com",
            age: 30,
            password: "password123",
        };

        const response = await request(app).post("/users").send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("El usuario ya existe");
    });
});
