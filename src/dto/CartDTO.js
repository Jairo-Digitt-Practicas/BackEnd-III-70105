/** @format */

class CartDTO {
    constructor({ _id, products, totalAmount, createdAt, updatedAt }) {
        this.id = _id;
        this.products = products.map((item) => ({
            product: item.product,
            quantity: item.quantity,
        }));
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = CartDTO;
