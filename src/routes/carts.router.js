/** @format */
const { Router } = require("express");
const {
    getAllCarts,
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCartProducts,
    updateProductQuantityInCart,
    deleteAllProductsFromCart,
} = require("../controllers/CartController.js");

const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const Ticket = require("../models/Ticket.js");
const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await createCart(req.body);
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(400).json({
            error: "Error al crear el carrito",
            details: error.message,
        });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        if (!cartId) {
            return res
                .status(400)
                .json({ error: "ID del carrito es requerido" });
        }
        const cart = await getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({
            error: "Error al obtener el carrito",
            details: error.message,
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const updatedCart = await addProductToCart(
            req.params.cid,
            req.params.pid
        );
        res.status(201).json(updatedCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al agregar el producto al carrito",
            details: error.message,
        });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const result = await removeProductFromCart(
            req.params.cid,
            req.params.pid
        );
        if (result) {
            res.json({ message: "Producto eliminado del carrito" });
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el producto del carrito",
            details: error.message,
        });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const updatedCart = await updateCartProducts(
            req.params.cid,
            req.body.products
        );
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al actualizar los productos del carrito",
            details: error.message,
        });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const updatedCart = await updateProductQuantityInCart(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al actualizar la cantidad del producto en el carrito",
            details: error.message,
        });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const result = await deleteAllProductsFromCart(req.params.cid);
        if (result) {
            res.json({ message: "Todos los productos eliminados del carrito" });
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar los productos del carrito",
            details: error.message,
        });
    }
});

function generateUniqueCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

router.post("/:cid/purchase", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate("products.product");
        if (!cart)
            return res.status(404).json({ message: "Carrito no encontrado" });

        if (!cart.user) {
            return res
                .status(400)
                .json({ error: "El carrito no tiene asociado un usuario." });
        }

        let totalAmount = 0;
        const productsNotProcessed = [];
        const productsProcessed = [];

        for (let item of cart.products) {
            const product = item.product;

            if (product && product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                totalAmount += product.price * item.quantity;

                productsProcessed.push(item);
            } else {
                productsNotProcessed.push(product._id);
            }
        }

        const ticket = await Ticket.create({
            code: generateUniqueCode(),
            user: cart.user,
            products: productsProcessed.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            total: totalAmount,
            createdAt: new Date(),
        });

        cart.products = cart.products.filter((item) =>
            productsNotProcessed.includes(item.product._id)
        );
        await cart.save();

        res.status(200).json({
            message: "Compra finalizada",
            ticket,
            productsNotProcessed,
        });
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        res.status(500).json({ error: "Error al finalizar la compra" });
    }
});

module.exports = router;
