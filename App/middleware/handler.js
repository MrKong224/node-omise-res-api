const { ErrorRequestHandler } = require('express');
const { CONFIG } = require('../config');
const { checkRequest } = require('./checkRequest');

const handlerCallAPI = async (req, res, next) => {
	try {
		await checkRequest(req);
		console.log(
			`****************************** Start Request API [${req.originalUrl}] **********************************************`,
		);
		console.log(`Start Call API: ${req.method}${req.originalUrl}`);
		console.log(`NODE_ENV: ${CONFIG.NODE_ENV}`);
		console.log(`Node version - ${process.version}`);
		console.log(`Current Request: ${JSON.stringify(req.curReq || {})}`);
		console.log(`Request Payload: ${JSON.stringify(req.body || {})}`);
		next();
	} catch (error) {
		next(error);
	}
};
const handlerRespAPI = async (req, res, next) => {
	const result = res.result;
	if (result) {
		console.log(
			`****************************** Stop and Response From API [${req.originalUrl}] **************************************`,
		);
		console.log(
			'##################################################################################################################################################',
		);
		res.status(200).send({
			output: result,
		});
	} else {
		const output = {
			output: 'Incorrect API',
		};
		res.result = output;
		console.log(
			`****************************** Stop and Response From API [${req.originalUrl}] **************************************`,
		);
		console.log(
			'##################################################################################################################################################',
		);
		res.status(404).send(output);
	}
};
const handlerError = (err, req, res, next) => {
	let errStatus = err.errStatus || 500;
	let returnErrMsg = {
		status: 'error',
		type: err.type || 'something error',
		// code: err.code,
		message: err.message,
	};
	// if (CONFIG.NODE_ENV === 'DEV' || err.isShowApiErr) {
	// 	returnErrMsg.isShowApiErr = err.isShowApiErr || false;
	// 	returnErrMsg.message = err.message;
	// }
	res.status(errStatus).send(returnErrMsg);
};

module.exports = {
	handlerCallAPI,
	handlerRespAPI,
	handlerError,
};
