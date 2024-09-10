import React, {useState} from 'react';
import api from './api';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState('');
  const [protectedData, setProtectedData] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.login(username, password);
      setToken(response.token);
      setIsLoggedIn(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Ошибка авторизации');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUserName('');
    setPassword('');
  }

  const handleProtectData = async () => {
    try {
      const data = await api.getProtectedData(token);
      setProtectedData(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage("Ошибка получения защищённых данных");
    }
  }

  return (
    <div>
      {!isLoggedIn && (
        <form onSubmit={handleLogin}>
          <h2>Авторизация</h2>
          <div>
            <label htmlFor="username">Логин: </label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              />
          </div>
          <div>
            <label htmlFor="password">Пароль: </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button type="submit">Войти</button>
        </form>
      )}

      {isLoggedIn && (
        <div>
          <h2>Добро пожаловать!</h2>
          <p>Вы успешно авторизовались</p>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      )}
    </div>
  );
}

export default App;