const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Защищённый маршрут
router.get('/', authenticateToken, () => {
    res.json({message: 'Это защищенный маршрут'});
});

module.exports = router;