const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
			.status(403)
			.json('Từ chối kết nối.')

	try {
		const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		req.userId = data._id;
		next();
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
}

module.exports = verifyToken;