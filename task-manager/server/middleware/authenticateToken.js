const jwt = require('jsonwebtoken');
const config = require('../config/config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({message: 'Нет токена'});
    }

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({message: 'Неверный токен'});
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;