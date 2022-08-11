import Vue from "vue";
import App from "./App.vue";

// 表格导出组件
import SCExcelExport from "../plugin";
Vue.use(SCExcelExport);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
