import React, {useState, useEffect} from 'react';
import axios from 'axios';

// Компонент для конвертации валют
function CurrencyConverter() {
  // Состояние для хранения суммы
  const [amount, setAmount] = useState('');
  // Состояние для хранения валюты, из которой конвертируем
  const [fromCurrency, setFromCurrency] = useState('USD');
  // Состояние для хранения валюты, в которую конвертируем
  const [toCurrency, setToCurrency] = useState('EUR');
  // Состояние для хранения результата конвертации
  const [result, setResult] = useState('');
  // Состояние для отслеживания процесса загрузки
  const [isLoading, setIsLoading] = useState(false);
  // Состояние для хранения ошибок
  const [error, setError] = useState(null);

  // API ключ для доступа к API обмена валют
  const APIKey = '0d7a502eee8ebe0dcef27bfa733fa2ea';
  // Базовый URL API
  const baseAPIurl = 'http://api.exchangeratesapi.io/latest';

  // Эффект, который запускается при изменении amount, fromCurrency или toCurrency
  useEffect(() => {
    // Асинхронная функция для получения курсов валют
    const fetchExchangeRates = async () => {
      // Установка состояния загрузки в true
      setIsLoading(true);
      try {
        // Выполняем запрос к API
        const response = await axios.get(`${baseAPIurl}?access_key=${APIKey}`);
        // Получаем курсы валют из ответа
        const rates = response.data.rates;
        // Вычисляем результат конвертации и устанавливаем его в состояние
        setResult(calculateConversion(amount, fromCurrency, toCurrency, rates));
      } catch(error) {
        // Устанавливаем ошибку в состояние
        setError(error);
      } finally {
        // Установка состояния загрузки в false
        setIsLoading(false);
      }
    };
    // Вызываем функцию для получения курсов валют
    fetchExchangeRates();
  }, [amount, fromCurrency, toCurrency]);

  // Функция для вычисления результата конвертации
  const calculateConversion = (amount, fromCurrency, toCurrency, rates) => {
    // Проверяем, что amount и rates не пустые
    if(!amount || !rates) return '';
    // Получаем курс валюты, из которой конвертируем
    const fromRate = rates[fromCurrency];
    // Получаем курс валюты, в которую конвертируем
    const toRate = rates[toCurrency];
    // Вычисляем результат конвертации и округляем до 2 знаков после запятой
    return (amount * (toRate / fromRate)).toFixed(2);
  };

  // Обработчик изменения суммы
  const handleAmountChange = (event) => {
    // Устанавливаем новую сумму в состояние
    setAmount(event.target.value);
  };

  // Обработчик изменения валюты, из которой конвертируем
  const handleFromCurrencyChange = (event) => {
    // Устанавливаем новую валюту в состояние
    setFromCurrency(event.target.value);
  };
  
  // Обработчик изменения валюты, в которую конвертируем
  const handleToCurrencyChange = (event) => {
    // Устанавливаем новую валюту в состояние
    setToCurrency(event.target.value);
  };

  // Возвращаем JSX код компонента
  return (
    <div className='container'>
      <h1>Конвертер валют</h1>
      {/* Ввод суммы */}
      <div className='input-group'>
        <label htmlFor='amount'>Сумма: </label>
        <input
          type='number'
          id='amount'
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      {/* Выбор валюты, из которой конвертируем */}
      <div className='input-group'>
        <label htmlFor="from-currency">Из: </label>
        <select id='from-currency' value={fromCurrency} onChange={handleFromCurrencyChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="RUB">RUB</option>
        </select>
      </div>
      {/* Выбор валюты, в которую конвертируем */}
      <div className='input-group'>
        <label htmlFor="to-currency">В: </label>
        <select id='to-currency' value={toCurrency} onChange={handleToCurrencyChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="RUB">RUB</option>
        </select>
      </div>
      {/* Отображение состояния загрузки */}
      {isLoading && <p>Загрузка...</p>}
      {/* Отображение ошибок */}
      {error && <p>Ошибка {error.message}</p>}
      {/* Отображение результата конвертации */}
      {result && <p>Результат: {result} {toCurrency}</p>}
    </div>
  );
}

// Экспорт компонента
export default CurrencyConverter;