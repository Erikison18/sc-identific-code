<template>
  <div id="app">
    <div class="demo">
      <h2>导出 DOM 元素表格</h2>
      <sc-excel-export
        file-name="表格"
        dom=".table"
        @on-success="handleExportSuccess"
        @on-error="handleExportError"
        style="margin-bottom: 10px;"
      >
        <button>导出</button>
      </sc-excel-export>

      <table class="table" style="margin-bottom: 10px;">
        <thead>
          <tr>
            <th rowspan="2">序号</th>
            <th colspan="2">基础信息</th>
            <th rowspan="2">合同编号</th>
            <th rowspan="2">额度</th>
            <th rowspan="2">所在地</th>
            <th rowspan="2">手机号</th>
          </tr>
          <tr>
            <th>姓名</th>
            <th>年龄</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in staffs" :key="index">
            <td align="center">{{ item.id }}</td>
            <td align="center">{{ item.username }}</td>
            <td align="center">{{ item.age }}</td>
            <td align="center">{{ item.code }}</td>
            <td align="center" data-format="#,##0.00">
              {{ item.income | amount }}
            </td>
            <td align="center">{{ item.region }}</td>
            <td align="center">{{ item.mobile }}</td>
          </tr>
        </tbody>
      </table>

      <h2>导出 JSON 数据为 excel 表格</h2>
      <sc-excel-export
        file-name="表格"
        :data="staffs"
        :columns="staffColumns"
        @on-success="handleExportSuccess"
        @on-error="handleExportError"
        style="margin-bottom: 10px;"
      >
        <button>导出</button>
      </sc-excel-export>

      <table class="table-two" style="margin-bottom: 10px;">
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>合同编号</th>
            <th>额度</th>
            <th>所在地</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in staffs" :key="index">
            <td align="center">{{ item.id }}</td>
            <td align="center">{{ item.username }}</td>
            <td align="center">{{ item.age }}</td>
            <td align="center">{{ item.code }}</td>
            <td align="center">{{ item.income | amount }}</td>
            <td align="center">{{ item.region }}</td>
          </tr>
        </tbody>
      </table>

      <h2>接口数据导出</h2>
      <sc-excel-export
        file-name="表格"
        :data="fetchData"
        :columns="staffColumns"
        :limit="20"
        @on-success="handleExportSuccess"
        @on-error="handleExportError"
        @on-cancel="handleExportCancel"
        style="margin-bottom: 10px;"
      >
        <button>导出</button>
      </sc-excel-export>

      <table class="table-three" style="margin-bottom: 10px;">
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>合同编号</th>
            <th>额度</th>
            <th>所在地</th>
            <th>手机号</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in staffs" :key="index">
            <td align="center">{{ item.id }}</td>
            <td align="center">{{ item.username }}</td>
            <td align="center">{{ item.age }}</td>
            <td align="center">{{ item.code }}</td>
            <td align="center">{{ item.income | amount }}</td>
            <td align="center">{{ item.region }}</td>
            <td align="center">{{ item.mobile }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-show="pending" class="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      pending: false,
      staffs: [],
      staffColumns: [
        { key: "id", title: "序号" },
        {
          key: "username",
          title: "姓名",
          format(val) {
            if (val.length === 2) return `*${val.slice(-1)}`;
            if (val.length >= 3)
              return [
                val.slice(0, 1),
                "*".repeat(val.length - 2),
                val.slice(-1)
              ].join("");
            return "**";
          }
        },
        { key: "age", title: "年龄" },
        {
          key: "income",
          title: "额度",
          format(value) {
            value = Number(value);
            if (value.isNaN) return value;
            value = `${value}`.split(".");
            if (value.length === 1)
              return value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") + ".00";
            return [
              value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"),
              value[1]
            ].join(".");
          }
        },
        { key: "region", title: "所在地" },
        { key: "mobile", title: "手机号" }
      ]
    };
  },
  filters: {
    amount(value) {
      value = Number(value);
      if (value.isNaN) return value;
      value = `${value}`.split(".");
      if (value.length === 1)
        return value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") + ".00";
      return [value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"), value[1]].join(
        "."
      );
    }
  },
  methods: {
    // 导出成功
    handleExportSuccess(params) {
      console.log(params);
      alert(`${params.name}导出成功`);
    },

    // 导出失败
    handleExportError(error) {
      alert(error);
    },

    // 取消导出
    handleExportCancel() {
      alert("操作已取消");
    },

    // 模拟后端接口返回数据
    // 通常，该方法是一个数据接口，这意味着它可以在任何页面或组件调用获取数据
    async fetchData(params = {}) {
      // 模拟网络延迟
      await (async () => new Promise(resolve => setTimeout(resolve, 600)))();

      // 构造数据
      const total = 100;
      const rows = new Array(params.pageSize || 5).fill("").map((_, index) => {
        return {
          id:
            (params.pageNo && params.pageNo
              ? (params.pageNo - 1) * params.pageSize
              : 0) +
            (index + 1),
          username: [
            ["赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯"][
              ~~(Math.random() * 9)
            ],
            ["晓", "宵", "龄", "万宁", "冠中", "娜英", "妙香", "达", "帅"][
              ~~(Math.random() * 9)
            ]
          ].join(""),
          age: [20, 21, 25, 28, 32, 33, 35, 38, 41][~~(Math.random() * 9)],
          income: [-200, 2011800, 200, 4012500][~~(Math.random() * 4)],
          code: new Array(16)
            .fill("")
            .map(() => ~~(Math.random() * 9))
            .join(""),
          region: [
            "北京",
            "上海",
            "福建",
            "广州",
            "四川",
            "新疆",
            "宁夏",
            "陕西",
            "河南"
          ][~~(Math.random() * 9)],
          mobile: "15684737723"
        };
      });

      return {
        total,
        list: rows
      };
    }
  },
  async mounted() {
    try {
      this.pending = true;
      const res = await this.fetchData();
      this.staffs = res.list;
    } catch (error) {
      console.error(error);
    } finally {
      this.pending = false;
    }
  }
};
</script>

<style lang="scss">
html {
  font-size: 14px;
}

body {
  font-size: 1rem;
  padding: 40px;
}

table,
th,
td {
  border: 1px #ddd solid;
}

table {
  border-collapse: collapse;
}

th,
td {
  padding: 8px 16px;
}

thead,
tbody tr:nth-of-type(even) {
  background-color: #fafafa;
}

button {
  background-image: linear-gradient(to bottom, #fff, #fafafa);
  border: 1px #ddd solid;
  border-radius: 4px;
  cursor: pointer;
  font-size: inherit;
  outline: none;
  padding: 8px 16px;

  &:hover {
    border-color: #ccc;
    background-image: linear-gradient(to bottom, #fafafa, #eee);
  }

  &:active {
    border-color: #09f;
    background-image: linear-gradient(to bottom, #fafafa, #eee);
    box-shadow: 0 0 0 3px fade-out(#09f, 0.85);
  }
}

.demo {
  position: relative;
  z-index: 1;
}

.loading {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  left: 0;
  right: 0;
  height: 100vh;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 999;
}
</style>
