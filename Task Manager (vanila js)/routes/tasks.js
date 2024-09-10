const express = require('express');
const router = express.Router();
const {createTask, getTasks, getTask, updateTask, deleteTask} = require('../controllers/taskController');
const auth = require('../middleware/auth');

//Создание задачи
router.post('/', auth, createTask);

//Получение всех задач
router.get('/', auth, getTasks);

//Получение задачи по id
router.get('/:id', auth, getTask);

//Обновление задач
router.put('/:id', auth, updateTask);

//Удаление задачи
router.delete('/:id', auth, deleteTask);

module.exports = router;