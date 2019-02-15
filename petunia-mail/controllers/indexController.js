const { validationResult } = require('express-validator/check');
const emailService = require('../services/emailService');
const title = 'Petunia'
const description = "We're building something big here. Something that changes how you socialize."

module.exports.main = (req, res, next) => {
	res.render('pages/index', {
		title,
		description,
		csrf: req.csrfToken()
	});
}

module.exports.signUp = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.render(
			'pages/errors',
			{ errors: errors.array() }
		);
	}
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(ip);
	try {
		const result = await emailService.saveEmail(req.body.email, ip);
		res.render('pages/signed-up', {
			title,
			description,
			message: result.message
		});
	} catch (err) {
		res.render(
			'pages/error',
			{
				message: "We couldn't save your email.",
				error: err
			}
		);
	}
}