const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(404).json({msg: "Нет токена, доступ запрещён"});
    }

        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded.user;
            next();
        } catch (err) {
            console.error('ОШибка проверки токена: ' + err.message);
            return res.status(401).json({msg: 'Токен недействителен'});

        }
};