import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function createChart(ctx, data) {
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.x,
      datasets: [{
        label: 'Данные',
        data: data.y,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return chart;
}




// function formatDate(timestamps) {
//   const formattedDates = timestamps.map(timestamp => {
//     const someDate = new Date(timestamp);
//     const formattedDate = `${someDate.getDate().toString().padStart(2, '0')}.${(someDate.getMonth() + 1).toString().padStart(2, '0')}.${someDate.getFullYear()}`;
//     const formattedTime = `${someDate.getHours().toString().padStart(2, '0')}.${someDate.getMinutes().toString().padStart(2, '0')}.${someDate.getSeconds().toString().padStart(2, '0')}`;
//     return { formattedDate, formattedTime };
//   });
//   // console.log(formattedDates); // добавил console.log
//   return formattedDates;
// }