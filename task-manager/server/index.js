const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const protectedRuotes = require('./routes/protected')

const app = express();
const port = process.env.PORT || 3001;

//ПОдключаемся к mongodb

mongoose.connect('mongodb://localhost:27017/test-base', {       // поменить на актуальную базу
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Парсер тела запросов
app.use(express.json());

//Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRuotes);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});