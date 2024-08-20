const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = [];

//Функция добавления таска в список

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const task = {
            text: taskText,
            completed: false,
        };

        // Пушим таску в массив
        tasks.push(task);

        //Обновляем список задач на странице
        renderTasks();

        //Очищаем поле ввода
        taskInput.value = '';
    }
}

//Функция для рендеринга списка задач на странице

function renderTasks() {
    //Очищаем список задач
    taskList.innerHTML = '';
    
    //Перебираем все задачи в массиве
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        
        // Добавляем класс для стиля
        listItem.classList.add('task-item');

        //Добавляем чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.id = `taskCheckbox-${index}`;
        checkbox.addEventListener('change', () => {
            //Обновить статус завершения задачи
            task.completed = checkbox.checked;
            //Обновить хранилище
            saveTasks();
        })
        listItem.appendChild(checkbox);

        //Добавить текст таски
        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = task.text;

        //При клике на текст сработает чекбокс
        taskTextElement.addEventListener("click", () =>{
            checkbox.checked = !checkbox.checked;
            task.completed = checkbox.checked;
            if(taskTextElement){
                taskTextElement.id = `task-text-${index}`;
            }
            saveTasks();
        });
        // То же самое для смартфона
        taskTextElement.addEventListener("touchend", () =>{
            checkbox.checked = !checkbox.checked;
            task.completed = checkbox.checked;
            if(taskTextElement){
                taskTextElement.id = `task-text-${index}`;
            }
            saveTasks();
        });
        listItem.appendChild(taskTextElement);

        //Добавить кнопку удаления
        const deleteButton = document.createElement('deleteButton');
        deleteButton.textContent = "Удалить";
        deleteButton.addEventListener('click', () => {
            tasks.splice(index, 1);
            renderTasks();
            saveTasks();
        })
        listItem.appendChild(deleteButton);

        //Добавить элемент списка в список задач
        taskList.appendChild(listItem);
    });
}

//Функция для сохранения задач в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


//Функция загрузки задач из хранилища
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if(storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

//Загрузить задачи при загрузке страницы
window.onload = loadTasks;

//Добавить обработчик события для кнопки добавления задачи
addButton.addEventListener('click', addTask);               // Длбавление по клику
addButton.addEventListener('touchend', addTask);            // Добавление по касанию кнопки "Добавить"
taskInput.addEventListener('keydown', function(enterKey) {  // Добавление по кнопке "ENTER"
    if (enterKey.key === "Enter") {
        addTask();
        renderTasks();
        saveTasks();
    }
});