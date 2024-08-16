import React, {useState, useEffect} from 'react';
import axios from 'axios';

function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const APIKey = '0d7a502eee8ebe0dcef27bfa733fa2ea';
  const baseAPIurl = 'http://api.exchangeratesapi.io/latest';

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true);
      try {
        const responce = await axios.get(`${baseAPIurl}?access_key=${APIKey}`);
        const rates = responce.data.rates;
        setResult(calculateConversion(amount, fromCurrency, toCurrency, rates));
      } catch(error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExchangeRates();
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = (amount, fromCurrency, toCurrency, rates) => {
    if(!amount || !rates) return '';
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    return (amount * (toRate / fromRate)).toFixed(2);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };
  
  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  return (
    <div className='container'>
      <h1>Конвертер валют</h1>
      <div className='input-group'>
        <label htmlFor='amount'>Сумма: </label>
        <input
          type='number'
          id='amount'
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
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
      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка {error.message}</p>}
      {result && <p>Результат: {result} {toCurrency}</p>}
    </div>
  );

}

export default CurrencyConverter;