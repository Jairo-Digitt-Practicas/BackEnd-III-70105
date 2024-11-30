/** @format */

const express = require("express");
const ProductController = require("../controllers/ProductController");
const authorize = require("../middlewares/authorize");
const passport = require("passport");

const router = express.Router();

router.get("/", ProductController.getAllProducts);

router.get("/:pid", ProductController.getProductById);

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    ProductController.createProduct
);

router.put(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    ProductController.updateProduct
);

router.delete(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    ProductController.deleteProduct
);

module.exports = router;
