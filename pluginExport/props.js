export default {
  fileName: String,

  timestamp: {
    type: Boolean,
    default: true
  },

  dom: String,

  data: [Function, Array],

  columns: {
    type: Array,
    default() {
      return [];
    }
  },

  params: {
    type: Object,
    default() {
      return null;
    }
  },

  hacks: {
    type: Array,
    default() {
      return [];
    }
  },

  max: {
    type: Number,
    default: () => 10000 * 150
  },

  limit: {
    type: Number,
    default: () => 5000
  },

  reqPageNo: {
    type: String,
    default: "pageNo"
  },

  reqPageSize: {
    type: String,
    default: "pageSize"
  },

  resTotal: {
    type: String,
    default: "total"
  },

  resData: {
    type: String,
    default: "list"
  },

  cancellable: {
    type: Boolean,
    default: true
  },

  disabled: Boolean
};
