const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
	path: path.join(__dirname, `./../env/.env.dev`),
});

const ENV = process.env;

module.exports.CONFIG = {
	NODE_ENV: ENV.NODE_ENV,
	IS_PRODUCTION: ENV.NODE_ENV === 'PROD' ? true : false,
	PORT: ENV.API_PORT,
	TIMEZONE: {
		zone: ENV.TIMEZONE,
		format_system: ENV.TIME_FORMAT_SYSTEM,
		format_email: ENV.TIME_FORMAT_EMAIL,
	},
	WEBHOOK: {
		activeAcc: ENV.WEBHOOK_ACTIVE_ACC,
		resetPassword: ENV.WEBHOOK_REST_PWD,
	},
};
