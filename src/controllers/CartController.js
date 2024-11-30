/** @format */

const cartService = require("../services/CartService");

exports.getAllCarts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { user: new RegExp(query, "i") } : {};
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: sort === "asc" ? { createdAt: 1 } : { createdAt: -1 },
        };

        const carts = await cartService.getAllCarts(filter, options);
        res.json({
            status: "success",
            payload: carts,
        });
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).json({ error: "Error al obtener carritos" });
    }
};

exports.createCart = async (req, res) => {
    try {
        const cartData = req.body;
        const cart = await CartService.createCart(cartData);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartService.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await CartService.addProductToCart(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCartProducts = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await CartService.updateCartProducts(cartId, products);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProductQuantityInCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await CartService.updateProductQuantityInCart(
            cartId,
            productId,
            quantity
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await CartService.deleteProductFromCart(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllProductsFromCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartService.deleteAllProductsFromCart(cartId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await CartService.removeProductFromCart(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const result = await CartService.purchaseCart(cartId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
