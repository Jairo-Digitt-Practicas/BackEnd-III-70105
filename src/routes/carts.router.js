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

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *
 *     Ticket:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         user:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         total:
 *           type: number
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los carritos
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Lista de carritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Error al obtener los carritos
 */
router.get("/", async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: Crea un nuevo carrito
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Error al crear el carrito
 */
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

/**
 * @swagger
 * /{cid}:
 *   get:
 *     summary: Obtiene un carrito por su ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito obtenido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error al obtener el carrito
 */
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

/**
 * @swagger
 * /{cid}/product/{pid}:
 *   post:
 *     summary: Agrega un producto al carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       201:
 *         description: Producto agregado al carrito
 *       400:
 *         description: Error al agregar el producto al carrito
 */
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

/**
 * @swagger
 * /{cid}/products/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error al eliminar el producto del carrito
 */
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

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualizar los productos de un carrito
 *     description: Actualiza la lista de productos de un carrito específico.
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Productos actualizados correctamente
 *       400:
 *         description: Error en la solicitud
 */
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

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en un carrito
 *     description: Actualiza la cantidad de un producto específico en un carrito.
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cantidad actualizada correctamente
 *       400:
 *         description: Error en la solicitud
 */
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

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Eliminar todos los productos de un carrito
 *     description: Elimina todos los productos de un carrito específico.
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Productos eliminados correctamente
 *       404:
 *         description: Carrito no encontrado
 */
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

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finalizar la compra de un carrito
 *     description: Procesa la compra de los productos en un carrito y genera un ticket.
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Compra finalizada correctamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Carrito no encontrado
 */
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
