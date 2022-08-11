import CodeManage from "./CodeManage.vue";

// 具体配置参考 CodeManage.vue 的 props
const DEFAULTS = {};

export default {
  install(Vue, options = {}) {
    if (Vue.prototype.$CodeManage) return;

    // 注册组件
    Vue.component("code-manage", CodeManage);

    // 挂载到 Vue 原型链
    // 在 .vue 文件中，可以使用 this.$CodeManage 查看属性
    Vue.prototype.$CodeManage = {
      options: Object.assign(DEFAULTS, options),
      component: CodeManage
    };
  }
};
