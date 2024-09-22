import axios from 'axios';
import { Chart } from 'chart.js';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './server.mjs';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';

async function getPrices() {
  try {
    const response = await axios.get(`http://localhost:3001/api/prices`);
    const data = response.data;
    console.log("\u0422\u0443\u0442 \u044F \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u0434\u0430\u043D\u043D\u044B\u0435 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: ", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
function createChart(ctx, data) {
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((price) => price.timestamp),
      datasets: [{
        label: "\u0426\u0435\u043D\u0430 \u043D\u0430 \u0431\u0438\u0442\u043A\u043E\u0438\u043D",
        data: data.map((price) => price.price),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  return chart;
}
const _sfc_main = {
  data() {
    return {
      chartLoaded: false,
      period: "day",
      startDate: "",
      endDate: "",
      prices: []
    };
  },
  methods: {
    async loadPrices() {
      try {
        const params = {
          period: this.period
        };
        if (this.period === "custom") {
          params.startDate = this.startDate;
          params.endDate = this.endDate;
        }
        const data = await getPrices(this.period);
        console.log("\u042D\u0442\u043E \u0432\u044B\u0432\u043E\u0434 \u0432 index.vue", data);
        this.prices = data;
        this.chartLoaded = true;
        if (this.$refs.chart && this.$refs.chart.length > 0) {
          const ctx = this.$refs.chart.getContext("2d");
          const chart = createChart(ctx, this.prices);
          this.chart = chart;
        } else {
          console.error("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 canvas \u0441 \u0440\u0435\u0444\u043E\u043C chart \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  },
  mounted() {
    this.chartLoaded = true;
    this.loadPrices();
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1>\u0418\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043E \u0446\u0435\u043D\u0430\u0445 \u043D\u0430 \u0431\u0438\u0442\u043A\u043E\u0438\u043D</h1><form><select><option value="day"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "day") : ssrLooseEqual($data.period, "day")) ? " selected" : ""}>\u0414\u0435\u043D\u044C</option><option value="week"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "week") : ssrLooseEqual($data.period, "week")) ? " selected" : ""}>\u041D\u0435\u0434\u0435\u043B\u044F</option><option value="month"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "month") : ssrLooseEqual($data.period, "month")) ? " selected" : ""}>\u041C\u0435\u0441\u044F\u0446</option><option value="year"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "year") : ssrLooseEqual($data.period, "year")) ? " selected" : ""}>\u0413\u043E\u0434</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "custom") : ssrLooseEqual($data.period, "custom")) ? " selected" : ""}>\u0421\u0432\u043E\u0439 \u043F\u0435\u0440\u0438\u043E\u0434</option></select>`);
  if ($data.period === "custom") {
    _push(`<input type="date"${ssrRenderAttr("value", $data.startDate)}>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.period === "custom") {
    _push(`<input type="date"${ssrRenderAttr("value", $data.endDate)}>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<button type="submit">\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435</button></form>`);
  if ($data.prices.length > 0) {
    _push(`<div>`);
    if ($data.chartLoaded) {
      _push(`<canvas></canvas>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-DPGL-beq.mjs.map
