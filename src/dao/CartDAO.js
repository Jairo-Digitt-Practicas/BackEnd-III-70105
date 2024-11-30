/** @format */

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Ticket = require("../models/Ticket");
const CartDTO = require("../dto/CartDTO");

class CartDAO {
    async getAll(filter = {}, options = {}) {
        const carts = await Cart.find(filter).populate("products.product");
        return carts.map((cart) => new CartDTO(cart));
    }

    async create(cartData) {
        const newCart = new Cart(cartData);
        const savedCart = await newCart.save();
        return new CartDTO(savedCart);
    }

    async getById(cartId) {
        const cart = await Cart.findById(cartId).populate("products.product");
        return cart ? new CartDTO(cart) : null;
    }

    async update(cartId, updateData) {
        const updatedCart = await Cart.findByIdAndUpdate(cartId, updateData, {
            new: true,
        }).populate("products.product");
        return updatedCart ? new CartDTO(updatedCart) : null;
    }

    async addProduct(cart, productId) {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Producto no encontrado");

        const existingProduct = cart.products.find(
            (p) => p.product.toString() === productId
        );
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        const updatedCart = await cart.save();
        return new CartDTO(updatedCart);
    }

    async updateProductQuantity(cart, productId, quantity) {
        const product = cart.products.find(
            (p) => p.product.toString() === productId
        );
        if (product) product.quantity = quantity;

        const updatedCart = await cart.save();
        return new CartDTO(updatedCart);
    }

    async deleteProduct(cart, productId) {
        cart.products = cart.products.filter(
            (p) => p.product.toString() !== productId
        );

        const updatedCart = await cart.save();
        return new CartDTO(updatedCart);
    }

    async createTicket(cart, productsProcessed, totalAmount) {
        const ticket = await Ticket.create({
            user: cart.user,
            products: productsProcessed.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            total: totalAmount,
            createdAt: new Date(),
        });
        return ticket;
    }
}

module.exports = new CartDAO();
