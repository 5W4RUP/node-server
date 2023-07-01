const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token || typeof token == 'undefined')
            throw new Error('Please login')

        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err)
                throw new Error('Invalid token')

            req.JWTObject = decoded;
            next()
        })
    } catch (error) {
        return res.status(401).json({
            error,
            message: error.message
        })
    }
}

module.exports = authenticateUser