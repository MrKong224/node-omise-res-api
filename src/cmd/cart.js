const Cart = require('../services/Cart');

const cart = new Cart();

function startInteractiveMode() {
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log('=== Cart Service Console ===');
	showAvailableCommands();

	rl.setPrompt('cart> ');
	rl.prompt();

	rl.on('line', (line) => {
		const args = line.trim().split(/\s+/);
		const command = args[0]?.toLowerCase();

		try {
			switch (command) {
				case 'add':
					if (args.length !== 4) {
						console.log('Usage: add <productId> <quantity> <price>');
						break;
					}
					const addResult = cart.addProduct(
						Number(args[1]), // productId
						Number(args[2]), // quantity
						Number(args[3]), // price
					);
					console.log('Product added:');
					console.log(JSON.stringify(addResult, null, 2));
					break;

				case 'update':
					if (args.length !== 4) {
						console.log('Usage: update <productId> <quantity> <price>');
						break;
					}
					const updateResult = cart.updateProduct(
						Number(args[1]), // productId
						Number(args[2]), // quantity
						Number(args[3]), // price
					);
					if (updateResult === null) {
						console.log('Product not found in cart');
					} else {
						console.log('Product updated:');
						console.log(JSON.stringify(updateResult, null, 2));
					}
					break;

				case 'remove':
					if (args.length !== 2) {
						console.log('Usage: remove <productId>');
						break;
					}
					const removeResult = cart.removeProduct(Number(args[1]));
					if (removeResult === null) {
						console.log('Product not found in cart');
					} else {
						console.log('Product removed:');
						console.log(JSON.stringify(removeResult, null, 2));
					}
					break;

				case 'add-voucher':
					if (args.length !== 2) {
						console.log('Usage: add-voucher <code>');
						break;
					}
					const addVoucherResult = cart.addVoucher(args[1]);
					console.log('Voucher added:');
					console.log(JSON.stringify(addVoucherResult, null, 2));
					break;

				case 'remove-voucher':
					if (args.length !== 2) {
						console.log('Usage: remove-voucher <code>');
						break;
					}
					const removeVoucherResult = cart.removeVoucher(args[1]);
					if (removeVoucherResult === null) {
						console.log('Voucher not found in cart');
					} else {
						console.log('Voucher removed:');
						console.log(JSON.stringify(removeVoucherResult, null, 2));
					}
					break;

				case 'list-vouchers':
					const listVouchersResult = cart.listVouchers();
					console.log('Voucher codes:');
					console.log(JSON.stringify(listVouchersResult, null, 2));
					break;

				case 'get':
					const cartContent = cart.getCart();
					console.log('Cart content:');
					console.log(JSON.stringify(cartContent, null, 2));
					break;

				case 'clear':
					const clearResult = cart.destroy();
					console.log('Cart emptied:');
					console.log(JSON.stringify(clearResult, null, 2));
					break;

				case 'help':
					showAvailableCommands();
					break;

				case 'exit':
				case 'quit':
					console.log('Exiting cart service. Goodbye!');
					rl.close();
					return;

				default:
					console.log(`Unknown command: ${command}. Type "help" for available commands.`);
			}
		} catch (error) {
			console.log(`Error: ${error.message}`);
		}

		rl.prompt();
	}).on('close', () => {
		process.exit(0);
	});
}

function showAvailableCommands() {
	console.log('Available commands:');
	console.log('  add <productId> <quantity> <price> - Add a product to cart');
	console.log('  update <productId> <quantity> <price> - Update product quantity and price in cart');
	console.log('  remove <productId> - Remove a product from cart');
	console.log('  get - Get contents of cart');
	console.log('  clear - Empty the cart');
	console.log('--------------------------------');
	console.log('  add-voucher <code> - Add a voucher code to cart');
	console.log('  remove-voucher <code> - Remove a voucher code from cart');
	console.log('  list-vouchers - List all voucher codes');
	console.log('--------------------------------');
	console.log('  exit - Exit the program');
}

// Run if called directly
if (require.main === module) {
	startInteractiveMode();
}
