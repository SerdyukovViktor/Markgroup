import axios from "axios";
import { Chart } from "chart.js";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "radix3";
import "defu";
import "ufo";
import "@vue/devtools-api";
import "devalue";
async function getPrices() {
  try {
    const response = await axios.get(`http://localhost:3001/api/prices`);
    const data = response.data;
    console.log("Тут я получил данные с сервера: ", data);
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
        label: "Цена на биткоин",
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
        console.log("Это вывод в index.vue", data);
        this.prices = data;
        this.chartLoaded = true;
        if (this.$refs.chart && this.$refs.chart.length > 0) {
          const ctx = this.$refs.chart.getContext("2d");
          const chart = createChart(ctx, this.prices);
          this.chart = chart;
        } else {
          console.error("Элемент canvas с рефом chart не существует");
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
  _push(`<div${ssrRenderAttrs(_attrs)}><h1>Исторические данные о ценах на биткоин</h1><form><select><option value="day"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "day") : ssrLooseEqual($data.period, "day")) ? " selected" : ""}>День</option><option value="week"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "week") : ssrLooseEqual($data.period, "week")) ? " selected" : ""}>Неделя</option><option value="month"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "month") : ssrLooseEqual($data.period, "month")) ? " selected" : ""}>Месяц</option><option value="year"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "year") : ssrLooseEqual($data.period, "year")) ? " selected" : ""}>Год</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray($data.period) ? ssrLooseContain($data.period, "custom") : ssrLooseEqual($data.period, "custom")) ? " selected" : ""}>Свой период</option></select>`);
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
  _push(`<button type="submit">Получить данные</button></form>`);
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
export {
  index as default
};
//# sourceMappingURL=index-DPGL-beq.js.map
