import axios from 'axios';
import moment from 'moment';

export async function getDBData() {
  try {
    // const params = {
    //   startDate,
    //   endDate
    // };
    const response = await axios.get(`http://localhost:3001/api/prices`);
    const data = response.data;
    
    if (data && data.length > 0) {
      const usdData = data.filter(item => item.currency === 'USD');
      const gbpData = data.filter(item => item.currency === 'GBP');
      const eurData = data.filter(item => item.currency === 'EUR');

      // console.log(data);
      // console.log(usdData);
      // console.log(gbpData);
      // console.log(eurData);


      return { usd: usdData, gbp: gbpData, eur: eurData}
    } else {
      return alert('Нет данных', error);
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}

