<template>
  <div>
    <canvas id="chart"></canvas>
    <select v-model="chartType" @change="switchChartType">
      <option value="USD">USD</option>
      <option value="GBP">GBP</option>
      <option value="EUR">EUR</option>

    </select>
  </div>
</template>

<script>
import { createChart } from '../components/chart';
import { Chart } from 'chart.js';

import { getDBData } from '../utils/api';

export default {
  data() {
    return {
      chartType: "USD",
      charts: {
        USD: {
          x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          y: [] //[1,2,3,,4,5,6,7,8,8,8]
        },
        GBP: {
          x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          y: [] // 
          //[3, 7, 2, 1, 8, 3, 1, 8, 11, 17]
        },
        EUR: {
          x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          y: [] //[3, 7, 2, 1, 8, 3, 1, 8, 11, 17]
        },
      },
      chart: null,
    }
  },
  async created() {
    const data = await getDBData();
    
    const pricesUSD = data.usd.map(item => item.price);
    const pricesGBP = data.gbp.map(item => item.price);
    const pricesEUR = data.eur.map(item => item.price);

    const timestampsUSD = data.usd.map(item => item.timestamp);
    const timestampsGBP = data.gbp.map(item => item.timestamp);
    const timestampsEUR = data.eur.map(item => item.timestamp);

      // console.log("USD Должен быть таким: ", pricesUSD);
      // console.log("GBP Должен быть таким: ", pricesGBP);
      // console.log("EUR Должен быть таким: ", pricesEUR);
  
    this.charts.USD.x = timestampsUSD;
    this.charts.USD.y = pricesUSD;
    this.charts.GBP.x = timestampsGBP;
    this.charts.GBP.y = pricesGBP;
    this.charts.EUR.x = timestampsEUR;
    this.charts.EUR.y = pricesEUR;

    // console.log('pricesUSD', pricesUSD);
    // console.log('pricesGBP', pricesGBP);
    // console.log('priceEUR', pricesEUR);

    // console.log("timestampsUSD", timestampsUSD);
    // console.log("timestampsGBP", timestampsGBP);
    // console.log("timestampsEUR", timestampsEUR);

    const ctx = document.getElementById('chart').getContext('2d');;
    this.chart = createChart(ctx, this.charts[this.chartType]);

  },
  methods: {
    switchChartType() {
      if(this.chart) {
        this.chart.destroy();
      }

      // console.log("Выбрана валюта: ", this.chartType);
      // console.log("Массив Y: ", this.charts[this.chartType].y);

      this.chart = createChart(
        document.getElementById('chart')
                .getContext('2d'), this.charts[this.chartType]);
    }
 },
}

</script>














