/** @format */

const bcrypt = require("bcryptjs");

const plainPassword = "gago123";

const hashFromDatabase =
    "$2b$10$IbNVABdn52H8wwwaKLdWpO7cue1U1n4Ynu6RFz1PzRC6JKoqe/1wu";

const isMatch = bcrypt.compareSync(plainPassword, hashFromDatabase);

console.log("Resultado de la comparación de contraseñas:", isMatch);
