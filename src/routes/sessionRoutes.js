/** @format */

const express = require("express");
const passport = require("passport");
const loginRoute = require("./login");
const registerRoute = require("./register");
const currentRoute = require("./current");

const sessionRouter = express.Router();

sessionRouter.use("/login", loginRoute);
sessionRouter.use("/register", registerRoute);

sessionRouter.use(
    "/current",
    passport.authenticate("jwt", { session: false }),
    currentRoute
);

module.exports = sessionRouter;
