import Export from "./Export.vue";

// 具体配置参考 Export.vue 的 props
const DEFAULTS = {};

export default {
  install(Vue, options = {}) {
    if (Vue.prototype.$SCExcelExoprt) return;

    // 注册组件
    Vue.component("sc-excel-export", Export);

    // 挂载到 Vue 原型链
    // 在 .vue 文件中，可以使用 this.$SCExcelExoprt 查看属性
    Vue.prototype.$SCExcelExoprt = {
      options: Object.assign(DEFAULTS, options),
      component: Export
    };
  }
};
