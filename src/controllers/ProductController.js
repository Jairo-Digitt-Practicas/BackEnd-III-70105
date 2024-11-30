/** @format */

const productService = require("../services/ProductService");

exports.getAllProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { category: new RegExp(query, "i") } : {};
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: sort === "asc" ? { price: 1 } : { price: -1 },
        };

        const products = await productService.getAllProducts(filter, options);

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
                : null,
            nextLink: products.hasNextPage
                ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
                : null,
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

const mongoose = require("mongoose");

exports.getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        console.log("ID recibido en el controlador:", pid);

        const product = await productService.getProductById(pid);
        console.log("Producto encontrado:", product);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error.message);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        console.log("ID recibido para actualizar:", pid);

        const updatedProduct = await productService.updateProduct(
            pid,
            req.body
        );
        console.log("Producto actualizado:", updatedProduct);

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        console.log("ID recibido para eliminar:", pid);

        const deletedProduct = await productService.deleteProduct(pid);
        console.log("Producto eliminado:", deletedProduct);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(204).end();
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
};
