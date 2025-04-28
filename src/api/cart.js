const express = require('express');

const cart = express.Router();

cart.get('/', (req, res, next) => {
	res.result = {
		msg: 'Hello World',
	};
	next();
});

module.exports = { cart };
