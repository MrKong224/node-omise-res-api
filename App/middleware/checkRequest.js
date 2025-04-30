const { v4: uuidv4 } = require('uuid');
const { CONFIG } = require('../config');

const checkRequest = async (req) => {
	try {
		console.log(
			'##################################################################################################################################################',
		);
		console.log(
			`****************************** Check API ACCESS KEY [API:${req.method}${req.originalUrl}] *********************************`,
		);
		req.curReq = {
			uuid: uuidv4(),
			accID: null,
		};
		const originURL = `${req.method}${req.originalUrl}`;
		const bypassApiAccessKey = [
			'POST/api/account/login',
			'POST/api/account/request-reset-pwd',
			'POST/api/account/reset-pwd',
			'POST/api/account/activate-account',
		];
		// if (!bypassApiAccessKey.includes(originURL)) {
		// 	const accId = await checkAuthen(req);
		// 	req.curReq.accID = accId;
		// }
	} catch (error) {
		throw error;
	}
};
const checkAuthen = async (req) => {
	const authToken = req.headers['authorization'];

	// Check if the token is not provided
	if (!authToken) {
		throw {
			type: 'CheckAccessToken',
			errStatus: 401,
			code: '401|Credentials',
			message: 'Access token is not correct',
		};
	}

	// Check if the token follows the correct format (Bearer token)
	if (!authToken.startsWith('Bearer ')) {
		throw {
			type: 'CheckAccessToken',
			errStatus: 401,
			code: '401|InvalidFormat',
			message: 'Invalid token format. Expected format: Bearer <token>',
		};
	}

	// Check if the token follows the expected pattern
	const tkn = authToken.split(' ');
	if (tkn.length !== 2) {
		throw {
			type: 'CheckAccessToken',
			errStatus: 401,
			code: '401|InvalidFormat',
			message: 'Invalid token format. Expected format: Bearer <token>',
		};
	}

	const token = tkn[1];

	if (token !== 'faketoken_user1') {
		throw {
			type: 'CheckAccessToken',
			errStatus: 401,
			code: '401|InvalidToken',
			message: 'Invalid token.',
		};
	}

	return 1;
};

module.exports = {
	checkRequest,
};
