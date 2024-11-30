/** @format */

const ViewsDAO = require("../dao/ViewsDAO");

const getRealtimeProducts = async (req, res) => {
    try {
        const products = await ViewsDAO.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

const getCartView = async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await ViewsDAO.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.render("cart", { cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
};

module.exports = {
    getRealtimeProducts,
    getCartView,
};
