/**
 * Cart service class that manages items in a cart
 */
class Cart {
	constructor() {
		this.items = [];
		this.voucherCodes = [];
	}

	listVoucherCodes = [
		{
			code: 'FX100',
			type: 'FIXED',
			discount: 100,
		},
		{
			code: 'FX200',
			type: 'FIXED',
			discount: 200,
		},
		{
			code: 'P10MX100',
			type: 'PERCENTAGE',
			percentage: 0.1,
			minTotalAmount: 2000,
			maxDiscount: 100,
		},
		{
			code: 'P25MX300',
			type: 'PERCENTAGE',
			percentage: 0.25,
			minTotalAmount: 2000,
			maxDiscount: 300,
		},
	];

	// Product
	addProduct(productId, quantity, price) {
		if (!productId || typeof productId !== 'number') {
			throw new Error('Product ID must be a valid number');
		}

		if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
			throw new Error('Quantity must be a positive number');
		}

		const existingProductIndex = this.items.findIndex((item) => item.productId === productId);

		if (existingProductIndex !== -1) {
			this.items[existingProductIndex].quantity += quantity;
			this.items[existingProductIndex].price += price;
		} else {
			this.items.push({ productId, quantity, price });
		}

		return this.getCart();
	}
	updateProduct(productId, quantity, price) {
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
			this.items[existingProductIndex].price = price;
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
	addVoucher(code) {
		if (!code || typeof code !== 'string') {
			throw new Error('Voucher code must be a valid string');
		}

		if (this.items.length <= 0) {
			throw new Error('Cart is empty');
		}

		const voucherCode = this.listVoucherCodes.find((voucher) => voucher.code === code);

		if (!voucherCode) {
			throw new Error('Voucher code not found');
		}

		if (this.voucherCodes.includes(voucherCode)) {
			throw new Error('Voucher code already applied');
		}

		if (voucherCode.type === 'PERCENTAGE') {
			if (this.calculateTotalPrice(this) < voucherCode.minTotalAmount) {
				throw new Error('Voucher code not applicable');
			}
		}

		this.voucherCodes.push(voucherCode);

		return this.getCart();
	}
	removeVoucher(code) {
		if (!code || typeof code !== 'string') {
			throw new Error('Voucher code must be a valid string');
		}

		const initialLength = this.voucherCodes.length;
		this.voucherCodes = this.voucherCodes.filter((voucher) => voucher.code !== code);

		if (this.voucherCodes.length === initialLength) {
			return null;
		}

		return this.getCart();
	}
	listVouchers() {
		return this.listVoucherCodes;
	}

	getCart() {
		return {
			items: [...this.items],
			totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
			totalUniqueItems: this.items.length,
			totalPrice: this.calculateTotalPrice(this),
			voucherCodes: this.voucherCodes,
		};
	}

	destroy() {
		this.items = [];
		return this.getCart();
	}

	calculateTotalPrice(cart) {
		let totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

		if (cart.voucherCodes.length <= 0 || totalPrice <= 0) {
			return totalPrice;
		}

		for (const voucher of cart.voucherCodes) {
			let discountAmount = 0;
			switch (voucher.type) {
				case 'FIXED':
					totalPrice -= voucher.discount;
					return totalPrice < 0 ? 0 : totalPrice;

				case 'PERCENTAGE':
					if (totalPrice >= voucher.minTotalAmount) {
						discountAmount = totalPrice * voucher.percentage;
						totalPrice -= discountAmount > voucher.maxDiscount ? voucher.maxDiscount : discountAmount;
					}
					return totalPrice < 0 ? 0 : totalPrice;

				default:
					return totalPrice;
			}
		}

		return totalPrice;
	}
}

module.exports = Cart;
