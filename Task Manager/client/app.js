const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const taskSection = document.getElementById('task-section');
const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userUsername = document.getElementById('user-username');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const addTaskButton = document.getElementById('add-task-button');
const taskList = document.getElementById('task-list');

// API base URL
const apiUrl = 'http://localhost:5500/api';

// Authentication functions
async function registerUser() {
  const username = usernameInput.value;
  const password = passwordInput.value;
  const token = getToken();

  try {
    const response = await fetch(`${apiUrl}/users/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      showUserSection();
    } else {
      const error = await response.json();
      alert(error.msg);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred during registration.');
  }
}

async function loginUser() {
  const username = usernameInput.value;
  const password = passwordInput.value;
  const token = getToken();

  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      showUserSection();
    } else {
      const error = await response.json();
      alert(error.msg);
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login.');
  }
}

async function getUser() {
  const token = getToken();

  if(!token){
    return alert('Необходимо войти в систему')
  }

  try {
    const response = await fetch(`${apiUrl}/users/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    if (response.ok) {
      const data = await response.json();
      userUsername.textContent = data.username;
      showTaskSection();
      return data;
    } else if(response.status === 401) {
      alert('Authentication required.');
      showAuthSection();
    } else {
      showAuthSection();
      // alert('Произошла ошибка при получении информации о пользователе.');
    }
  } catch (error) {
    console.error('Error getting user info:', error);
    alert('An error occurred while fetching user information.');
  }
}

// Task functions
async function addTask() {
  const token = getToken();
  
  if(!token){
    showAuthSection();
  }

  const title = taskTitleInput.value;
  const description = taskDescriptionInput.value;
  const user = await getUser();

  if(!title){
    alert('Введите заголовок задачи');
    return;
  }


  try {
    const response = await fetch(`${apiUrl}/tasks/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, description, user: user.id })
    });

    if(!title){
      alert('Введите заголовок задачи');
      return;
    }

    if (response.ok) {
      const data = await response.json();
      renderTasks();
      taskTitleInput.value = '';
      taskDescriptionInput.value = '';
    } else if(response.status === 401){
      alert('Authentication required.');
      showAuthSection();
    } else {
      const error = await response.json();
      alert(error.msg);
    }
  } catch (error) {
    console.error('Error adding task:', error);
    alert('An error occurred while adding the task.');
  }
}

async function renderTasks() {
  const token = getToken();

  if(!token){
    showAuthSection();
  }

  try {
    const response = await fetch(`${apiUrl}/tasks`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    if (response.ok) {
      const tasks = await response.json();
      taskList.innerHTML = '';
      
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        const buttonText = `${task.completed ? 'ГОТОВА' : 'ВЫПОЛНИТЬ'}`
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
          <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
          <p>${task.description}</p>
          <button data-task-id="${task._id}" data-completed="${task.completed ? 'true' : 'false'}">
            ${buttonText}
          </button>
          <button data-task-id="${task._id}" class="delete-task-button">Удалить</button> 
        `;
        taskList.appendChild(taskItem);
      });
      addMarkCompleteListeners();
      addDeleteTaskListener();
    } else {
      alert('Authentication required.');
      showAuthSection();
    }
  } catch (error) {
    console.error('Error rendering tasks:', error);
    alert('An error occurred while fetching tasks.');
  }
}

async function markTaskComplete(taskId, completed) {
  const token = getToken();

  if(!token){
    showAuthSection();
  }

  try {
    const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ completed })
    });

    if (response.ok) {
      renderTasks();
    } else {
      const error = await response.json();
      alert(error.msg);
    }
  } catch (error) {
    console.error('Error marking task complete:', error);
    alert('An error occurred while marking the task.');
  }
}

async function deleteTask(taskId) {
  const token = getToken();

  if(!token){
    showAuthSection();
  }

  try {
    const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'x-auth-token': token
      }
    });

    if(response.ok){
      localStorage.setItem('taskIdToDelete', taskId);
      renderTasks();
    } else {
      const error = await response.json();
      alert(error.msg);
    }
  } catch (error) {
    console.error('Error deleting task', error);
    alert('An error occurred while deleting task.')
  }
}

// Кнопка выхода
async function logoutUser() {
  localStorage.removeItem('token');
  showAuthSection();
}


// UI functions
function showAuthSection() {
  authSection.style.display = 'block';
  userSection.style.display = 'none';
  taskSection.style.display = 'none';
}

function showUserSection() {
  authSection.style.display = 'none';
  userSection.style.display = 'block';
  getUser();
  renderTasks();
}

function showTaskSection() {
  authSection.style.display = 'none';
  userSection.style.display = 'block';
  taskSection.style.display = 'block';
  renderTasks();

  addTaskButton.addEventListener('click', addTask);
}

// Event listeners
registerButton.addEventListener('click', registerUser);
loginButton.addEventListener('click', loginUser);
logoutButton.addEventListener('click', logoutUser);

// Check for existing token
const token = getToken();
if (token) {
  showUserSection();
} else {
  showAuthSection();
}

// Add event listener for marking tasks complete
function addMarkCompleteListeners() {
  const completeButtons = taskList.querySelectorAll('button');
  completeButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const taskId = button.dataset.taskId;
      button.dataset.completed = button.dataset.completed === "true" ? "false" : "true";
      const completed = button.dataset.completed === "true";
      await markTaskComplete(taskId, completed);
    });
  });
}

function addDeleteTaskListener() {
  const deleteButtons = taskList.querySelectorAll('.delete-task-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const taskId = button.dataset.taskId;
      deleteTask(taskId);
    });
  });
}

function getToken() {
  return localStorage.getItem('token');
}