import Vue from "vue";
import App from "./App.vue";

// 表格导出组件
import CodeManage from "../plugin";
Vue.use(CodeManage);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
