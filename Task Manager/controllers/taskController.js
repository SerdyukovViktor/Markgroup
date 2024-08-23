const Task = require('../models/Task');

//Создание новой задачи
exports.createTask = async (req, res) => {
    const {title, description} = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            user: req.user.id
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Произошла Ошибка на сервере'});
    }
};

//Получение всех задач пользователя
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user.id});
        res.status(200).json(tasks);
    } catch (err) {
        console.error(msg.error);
        res.status(500).json({msg: "Тут Ошибка на сервере"});
    }
};

//Получение задачи по id
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({msg: 'Задача не найдена'});
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: "Странно, Ошибка на сервере"});
    }
};

//Обновление задачи
exports.updateTask = async (req, res) => {
    const {title, description, completed} = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id},
            {title, description, completed: req.body.completed},
            {new: true});

        if(!task) {
            return res.status(404).json({msg: 'Задача не найдена'});
        }

        // await task.save();
        res.status(200).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: "Может тут Ошибка на сервере"});
    }
}

//Удаление задачи
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if(!task){
            return res.status(404).json({msg: 'Задача не найдена'});
        }

        // await task.remove();
        res.status(200).json({msg: 'Задача удалена'});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Отработал taskController/deleteTasks/Catch'});
    }
};