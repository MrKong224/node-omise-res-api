/**
 * Cart service class that manages items in a cart
 */
class Cart {
	constructor() {
		this.items = [];
		this.discounts = [];
	}

	// Product
	addProduct(productId, quantity) {
		if (!productId || typeof productId !== 'number') {
			throw new Error('Product ID must be a valid number');
		}

		if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
			throw new Error('Quantity must be a positive number');
		}

		const existingProductIndex = this.items.findIndex((item) => item.productId === productId);

		if (existingProductIndex !== -1) {
			this.items[existingProductIndex].quantity += quantity;
		} else {
			this.items.push({ productId, quantity });
		}

		return this.getCart();
	}
	updateProduct(productId, quantity) {
		if (!productId || typeof productId !== 'number') {
			throw new Error('Product ID must be a valid number');
		}

		if (typeof quantity !== 'number' || quantity < 0) {
			throw new Error('Quantity must be a positive number');
		}

		const existingProductIndex = this.items.findIndex((item) => item.productId === productId);

		if (existingProductIndex === -1) {
			return null;
		}

		if (quantity === 0) {
			return this.removeProduct(productId);
		} else {
			this.items[existingProductIndex].quantity = quantity;
		}

		return this.getCart();
	}
	removeProduct(productId) {
		if (!productId || typeof productId !== 'number') {
			throw new Error('Product ID must be a valid number');
		}

		const initialLength = this.items.length;
		this.items = this.items.filter((item) => item.productId !== productId);

		if (this.items.length === initialLength) {
			return null;
		}

		return this.getCart();
	}

	// Discount code
	addDiscount(code) {
		if (!code || typeof code !== 'string') {
			throw new Error('Discount code must be a valid string');
		}

		this.discounts.push(code);

		return this.getCart();
	}
	removeDiscount(code) {
		if (!code || typeof code !== 'string') {
			throw new Error('Discount code must be a valid string');
		}

		const initialLength = this.discounts.length;
		this.discounts = this.discounts.filter((discount) => discount !== code);

		if (this.discounts.length === initialLength) {
			return null;
		}

		return this.getCart();
	}

	getCart() {
		return {
			items: [...this.items],
			totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
			totalUniqueItems: this.items.length,
			discountCodes: this.discounts,
		};
	}

	destroy() {
		this.items = [];
		return this.getCart();
	}
}

module.exports = Cart;
