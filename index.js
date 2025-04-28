const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const { CONFIG } = require('./App/config');
const { handlerCallAPI, handlerRespAPI, handlerError } = require('./App/middleware/handler');

const { account } = require('./src/api/account');
const { cart } = require('./src/api/cart');

const app = express();
const PORT = CONFIG.PORT;

// compresses all the responses
app.use(compression());

// adding set of security middlewares
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable all CORS request
app.use(cors());
app.use(handlerCallAPI);

app.listen(PORT, () => {
	const curDT = new Date().toLocaleString();
	console.log('--------------------------------------------------------------------------------------');
	console.log(`${curDT} | Web server - start up process`);
	console.log(`${curDT} | Node version - ${process.version}`);
	console.log(`${curDT} | Express server mode initialized`);
	console.log(`${curDT} | Start services at port : ${PORT}`);
	console.log(`${curDT} | node env : ${CONFIG.NODE_ENV}`);
	console.log(`${curDT} | IS_PRODUCTION : ${CONFIG.IS_PRODUCTION}`);
	console.log('--------------------------------------------------------------------------------------');
});

// list routing api
app.get('/hello', (req, res, next) => {
	res.result = {
		msg: 'Hello World',
	};
	next();
});

app.use('/api/account', account);
app.use('/api/cart', cart);

app.use(handlerRespAPI);
app.use(handlerError);
