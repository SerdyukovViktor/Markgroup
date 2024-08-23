const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

//Регаем нового юзера
exports.registerUser = async(req, res) => {
    const {username, password} = req.body;

    try{
        let user = await User.findOne({username});
        if(user) {
            return res.status(400).json({msg: "Пользователь уже существует"});
        }

        user = new User({username, password})

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.jwtSecret, {expiresIn: 360000}, (err, token) => {
            if(err) {
                console.error('Ошибка генерации токена: ', err.message);
                return res.status(500).json({msg: 'Ошибка на сервере'});
            }
            res.status(201).json({token});
        });

    } catch(err) {
        console.error(err.message);
        res.status(500).json({msg: 'Ошибка регистрации'});
    }
};

//Вход в систему
exports.loginUser = async (req, res) => {
    const {username,password} = req.body;

    try {
        let user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({msg : 'Неверный логин или пароль'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({msg : 'Неверный логин или пароль'});
        }
        
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.jwtSecret, {expiresIn: 360000}, (err, token) => {
            if(err) {
                console.error('Ошибка генерации токена: ', err.message);
                return res.status(500).json({msg: 'Ошибка на сервере'});
            }
            res.status(200).json({token});
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Ошибка на сервере'});
    }
};

//Получение информации о текущем пользователе
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Ошибка на сервере'});
    }
};