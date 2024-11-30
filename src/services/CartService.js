/** @format */

const CartDAO = require("../dao/CartDAO");
const CartDTO = require("../dto/CartDTO");

class CartService {
    async getAllCarts(filter = {}, options = {}) {
        return await CartDAO.getAll(filter, options);
    }

    async createCart(cartData) {
        const cart = await CartDAO.create(cartData);
        return new CartDTO(cart);
    }

    async getCartById(cartId) {
        const cart = await CartDAO.getById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");
        return new CartDTO(cart);
    }

    async addProductToCart(cartId, productId) {
        const cart = await CartDAO.getById(cartId);
        await CartDAO.addProduct(cart, productId);
        return new CartDTO(cart);
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const cart = await CartDAO.getById(cartId);
        await CartDAO.updateProductQuantity(cart, productId, quantity);
        return new CartDTO(cart);
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await CartDAO.getById(cartId);
        await CartDAO.deleteProduct(cart, productId);
        return new CartDTO(cart);
    }

    async purchaseCart(cartId) {
        const cart = await CartDAO.getById(cartId);
        let totalAmount = 0;
        const productsProcessed = cart.products.filter((item) => {
            if (item.product.stock >= item.quantity) {
                totalAmount += item.quantity * item.product.price;
                item.product.stock -= item.quantity;
                return true;
            }
            return false;
        });

        const ticket = await CartDAO.createTicket(
            cart,
            productsProcessed,
            totalAmount
        );
        await Promise.all(productsProcessed.map((item) => item.product.save()));
        return { message: "Compra finalizada", ticket };
    }
}

module.exports = new CartService();
