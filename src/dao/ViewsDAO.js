/** @format */

const Product = require("../models/Product");
const Cart = require("../models/Cart");
const ProductDTO = require("../dto/ProductDTO");
const CartDTO = require("../dto/CartDTO");

class ViewsDAO {
    async getAllProducts() {
        const products = await Product.find();
        return products.map((product) => new ProductDTO(product));
    }

    async getCartById(cartId) {
        const cart = await Cart.findById(cartId).populate("products.product");
        return cart ? new CartDTO(cart) : null;
    }
}

module.exports = new ViewsDAO();
