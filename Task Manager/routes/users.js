const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getUser} = require('../controllers/userController');
const auth = require('../middleware/auth');

//Регистрация 
router.post('/register', registerUser);

//Вход
router.post('/login', loginUser);

//Инфо о юзере
router.get('/me', auth, getUser);

module.exports = router;