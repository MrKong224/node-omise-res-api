const express = require('express');
const { mock_account } = require('../../util/account');

const account = express.Router();

account.get('/:accountId', (req, res, next) => {
	const { accountId } = req.params;

	// Validate accountId format
	const accountIdRegex = /^[0-9]+$/;
	if (!accountIdRegex.test(accountId)) {
		next({
			errStatus: 400,
			type: 'InvalidAccountIdFormat',
			message: 'Invalid accountId format',
		});
	}

	const account = mock_account.find((account) => account.id === +accountId);

	res.result = {
		data: account || null,
		msg: account ? 'Get account successfully' : 'Account not found',
	};
	next();
});
account.post('/register', (req, res, next) => {
	const payload = req.body;

	const { email, password } = payload;

	const account = mock_account.find((account) => account.email === email);

	// Validate email format
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email)) {
		next({
			errStatus: 400,
			type: 'InvalidEmailFormat',
			code: '400|InvalidEmailFormat',
			message: 'Invalid email format',
		});
	}

	// Validate password format
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%^$!%*?&])[A-Za-z\d@#%^$!%*?&]{8,}$/;
	if (!passwordRegex.test(password)) {
		next({
			errStatus: 400,
			type: 'InvalidPasswordFormat',
			code: '400|InvalidPasswordFormat',
			message: 'Invalid password format',
		});
	}

	// Validate if account already exists
	if (account) {
		next({
			errStatus: 400,
			type: 'AccountAlreadyExists',
			code: '400|AccountAlreadyExists',
			message: 'Account already exists',
		});
	}

	// Connect to database

	res.result = {
		msg: 'Create account successfully',
	};
	next();
});
account.patch('/profile', (req, res, next) => {
	const payload = req.body;
	const { accountId } = payload;

	// Validate accountId format
	const accountIdRegex = /^[0-9]+$/;
	if (!accountIdRegex.test(accountId)) {
		next({
			errStatus: 400,
			type: 'InvalidAccountIdFormat',
			message: 'Invalid accountId format',
		});
	}

	const account = mock_account.find((account) => account.id === +accountId);

	if (!account) {
		next({
			errStatus: 404,
			type: 'AccountNotFound',
			message: 'Account not found',
		});
	}
	res.result = {
		msg: payload,
	};
	next();
});
account.patch('/password', (req, res, next) => {
	const payload = req.body;
	const { accountId, currentPassword, newPassword, confirmPassword } = payload;

	// Validate accountId format
	const accountIdRegex = /^[0-9]+$/;
	if (!accountIdRegex.test(accountId)) {
		next({
			errStatus: 400,
			type: 'InvalidAccountIdFormat',
			message: 'Invalid accountId format',
		});
	}

	const account = mock_account.find((account) => account.id === +accountId);

	if (!account) {
		next({
			errStatus: 404,
			type: 'AccountNotFound',
			message: 'Account not found',
		});
	}

	if (currentPassword !== account.password) {
		next({
			errStatus: 400,
			type: 'InvalidCurrentPassword',
			message: 'Invalid current password',
		});
	}

	if (newPassword !== confirmPassword) {
		next({
			errStatus: 400,
			type: 'InvalidConfirmPassword',
			message: 'New password and confirm password do not match',
		});
	}

	// Validate password format
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%^$!%*?&])[A-Za-z\d@#%^$!%*?&]{8,}$/;
	if (!passwordRegex.test(newPassword) || !passwordRegex.test(confirmPassword)) {
		next({
			errStatus: 400,
			type: 'InvalidPasswordFormat',
			code: '400|InvalidPasswordFormat',
			message: 'Invalid password format',
		});
	}

	res.result = {
		msg: 'Update password successfully',
	};
	next();
});
account.delete('/:accountId', (req, res, next) => {
	const { accountId } = req.params;

	// Validate accountId format
	const accountIdRegex = /^[0-9]+$/;
	if (!accountIdRegex.test(accountId)) {
		next({
			errStatus: 400,
			type: 'InvalidAccountIdFormat',
			message: 'Invalid accountId format',
		});
	}

	const account = mock_account.find((account) => account.id === +accountId);

	if (!account) {
		next({
			errStatus: 404,
			type: 'AccountNotFound',
			message: 'Account not found',
		});
	}

	// Connect to database

	res.result = {
		msg: 'Delete account successfully',
	};
	next();
});

module.exports = {
	account,
};
