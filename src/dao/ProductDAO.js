/** @format */

const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductDTO = require("../dto/ProductDTO");

class ProductDAO {
    async getAll(filter = {}, options = {}) {
        const products = await Product.paginate(filter, options);
        return products;
    }

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const product = await Product.findById(id);
        return product ? new ProductDTO(product) : null;
    }

    async create(productData) {
        const product = new Product(productData);
        await product.save();
        return new ProductDTO(product);
    }

    async update(id, productData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            productData,
            { new: true }
        );
        return updatedProduct ? new ProductDTO(updatedProduct) : null;
    }

    async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        return deletedProduct ? new ProductDTO(deletedProduct) : null;
    }
}

module.exports = new ProductDAO();
