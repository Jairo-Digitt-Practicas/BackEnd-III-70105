/** @format */

const ProductDAO = require("../dao/ProductDAO.js");

class ProductService {
    async getAllProducts(filter, options) {
        return await ProductDAO.getAll(filter, options);
    }

    async getProductById(id) {
        return await ProductDAO.getById(id);
    }

    async createProduct(productData) {
        return await ProductDAO.create(productData);
    }

    async updateProduct(id, productData) {
        return await ProductDAO.update(id, productData);
    }

    async deleteProduct(id) {
        return await ProductDAO.delete(id);
    }
}

module.exports = new ProductService();
