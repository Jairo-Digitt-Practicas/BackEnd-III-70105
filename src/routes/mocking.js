/** @format */

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

function generateMockUsers(count) {
    return Array.from({ length: count }).map(() => {
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
}

function generateMockPets(count) {
    return Array.from({ length: count }).map(() => ({
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
}

module.exports = { generateMockUsers, generateMockPets };
