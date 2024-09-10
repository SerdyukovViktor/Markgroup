const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../../../Task Manager/config/config');
const config = require('../config/config');

const router = express.Router();

//Регистрация нового юзера
router.post('/register', async (req, res) =>{
    const {username, password} = req.body;

    try {
        // Проверка, существует ли пользователь
        const existingUser = await User.findOne({username});

        if (existingUser) {
            return res.status(409).json({message: "Пользователь уже существует"});
        }

        //Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаём нового пользователя
        const newUser = new User({username, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: 'Пользовател успешно зарегистрирован'});
    } catch (error) {
        console.error('Ошибка регистрации: ',error);
        res.status(500).json({message: 'Ошибка регистрации'})
    }
});

//Блок авторизации юзера

router.post('/auth', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({message: 'Такого пользователя не существует'});
        }

        //Проверка пользователя
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Неверный логин или пароль'});
        }

        //Генерация токена JWT
        const token = jwt.sign({userId: user._id}, config.jwtSecret, { expiresIn: '1h'});   //Не забыть добавить jwt
        
        res.status(201).json({ message: 'Авторизация прошла успешно', token})
    } catch (error) {
        console.error('ОШибка авторизации',error);
        res.status(500).json({message: 'Ошибка авторизации'});
    }
});

module.exports = router;