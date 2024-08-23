const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const usersRouter = require('./routes/users');
const taskRouters = require('./routes/tasks');

const app = express();
app.use(cors());

//  Отдача  статических  файлов  из  корневой  папки
app.use(express.static(__dirname));

//Подключение к БД
connectDB();

//Middleware для обработки JSON
app.use(express.json());

//Маршруты для юзеров
app.use('/api/users', usersRouter);

//Маршруты для задч
app.use('/api/tasks', taskRouters);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));