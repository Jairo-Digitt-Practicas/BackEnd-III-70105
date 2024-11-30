/** @format */

const bcrypt = require("bcrypt");

const plainPassword = "password1236";

const hashedPassword = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10));

console.log("Contraseña encriptada:", hashedPassword);

const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
console.log("¿Coinciden las contraseñas?", isMatch);
