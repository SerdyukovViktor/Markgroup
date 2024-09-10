import axios from 'axios';

const api = {
    baseUrl: 'http://localhost:3001/api',

    register: async (username, password) => {
        try {
            const response = await axios.post(`${api.baseUrl}/auth/register`, {
                username,
                password,
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка регистрации: ',error);
            throw error; // Перебрасываем ошибку для обработки в компоненте
        }
    },

    login: async (username, password) => {
        try {
            const response = await axios.post(`${api.baseUrl}/auth/login`, {
                username,
                password,
            });
            return response.data;
        } catch (error) {
            console.error('ОШибка авторизации: ',error);
            throw error;
        }
    },

    getProtectedData: async (token) => {
        try {
            const response = await axios.get(`${api.baseUrl}/protected`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка получения защищённых данных: ',error);
            throw error;
        }
    }
}

export default api;