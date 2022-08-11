<template>
  <div
    :class="['sc-excel-export', exporting ? 'exporting' : '']"
    :disabled="disabled"
  >
    <div
      v-show="!exporting"
      class="sc-excel-export-handle"
      @click.stop="handleExport"
    >
      <slot />
    </div>
    <div v-show="exporting" class="sc-excel-export-progress-wrap">
      <div class="sc-excel-export-progress">
        <div
          class="sc-excel-export-bar"
          :style="`width: ${percent ? `${percent}%` : '54px'};`"
        >
          <span>
            <template v-if="percent">
              <template v-if="percent === 100">生成 Excel 中</template>
              <template v-else>{{ percent }}%</template>
            </template>
            <template v-else>加载中</template>
          </span>
        </div>
      </div>
      <div
        v-if="cancellable"
        class="sc-excel-export-cancel"
        @click="handleCancel"
      >
        取消
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Table2Excel from "table2excel.js";
import FileSaver from "file-saver";
import ExcelJS from "exceljs";

import * as utils from "./utils";
import props from "./props";

export default {
  name: "SCExcelExport",
  props,
  data() {
    return {
      exporting: false, // 是否正在导出
      total: 0, // 数据总条数
      tsTotal: 0, // 分页加载时，生成的分页数
      tsLoaded: 0, // 分页加载时，加载的进度
      placeholder: ""
    };
  },
  computed: {
    // 加载进度
    percent() {
      const { exporting } = this;
      if (!exporting) return 0;
      return Math.ceil((this.tsLoaded / this.tsTotal) * 100);
    },

    // 最终导出的文件名
    fileSaveName() {
      const { fileName, timestamp } = this.$props;
      const type = "xlsx";
      if (timestamp) {
        return `${fileName}-${moment().format("YYYYMMDDHHmmss")}.${type}`;
      }
      return `${fileName}.${type}`;
    }
  },
  watch: {
    // 加载进度更新时执行
    tsLoaded() {
      this.$emit("on-progress", {
        total: this.tsTotal,
        loaded: this.tsLoaded
      });
    }
  },
  methods: {
    // 开始导出
    async handleExport() {
      try {
        this.exporting = true;

        const { fileName, timestamp, columns, data, dom } = this.$props;
        if (!fileName) throw "请指定导出文件的文件名！";
        const type = "xlsx";

        let saveName = "";
        if (timestamp) {
          saveName = `${fileName}-${utils.timestamp}.${type}`;
        } else {
          saveName = `${fileName}.${type}`;
        }

        // 记录开始时间
        this.timeStart = new Date().getTime();

        // 是否导出 Dom 表格
        if (dom) {
          await this.table2excel(dom, saveName.replace(/\.xlsx/, ""));
        } else {
          // 使用 exceljs 导出
          if (!columns || !Array.isArray(columns) || !columns.length)
            throw "请配置表格导出属性 columns！";

          // 如果传入的是静态数据，则直接创建 Excel，否则从接口获取数据
          if (Array.isArray(data)) {
            await this.excel([...data], saveName);
          } else {
            await this.lgExcel(data, saveName);
          }

          // 固定进度为 100%
          this.loaded = this.total;
        }

        // 记录结束时间
        this.timeEnd = new Date().getTime();
        const takeTime = moment(this.timeEnd).diff(this.timeStart);

        // 导出被取消
        if (!this.exporting) return;

        // 暂停一下，等滚动条走完
        this.exporting = false;
        await utils.sleep(600);

        this.$emit("on-success", {
          name: fileName,
          saveName,
          message: `${fileName} 导出成功！`,
          takeTime
        });
      } catch (error) {
        this.$emit("on-error", error);
      } finally {
        this.timeStart = null;
        this.timeEnd = null;
        this.total = 0;
        this.tsTotal = 0;
        this.tsLoaded = 0;
        this.exporting = false;
      }
    },

    // 取消导出
    async handleCancel() {
      this.exporting = false;
      await utils.sleep(100);
      this.$emit("on-cancel");
    },

    // DOM 导出 Excel
    async table2excel(dom, fileName) {
      if (!dom) throw "请指定需要导出的表格元素！";
      const table2excel = new Table2Excel(dom, {
        plugins: [
          Table2Excel.plugins.alignmentPlugin,
          Table2Excel.plugins.autoWidthPlugin,
          {
            workcellCreated({ workcell, cell }) {
              let innerText = `${cell.innerText}`.replace(/^(\s+)|(\s+)$/, "");

              // 简单数字格式化
              if (utils.isNum(innerText)) {
                innerText = Number(innerText);
              }

              // 金额
              if (utils.isAmount(innerText)) {
                innerText = Number(`${innerText}`.replace(/,/g, ""));
                workcell.numFmt = "#,##0.00";
              }

              // 行内格式
              if (cell.getAttribute("data-format")) {
                workcell.numFmt = cell.getAttribute("data-format");
              }

              workcell.value = utils.hack(innerText);
            }
          }
        ]
      });

      // 更新进度
      this.tsTotal = 100;
      this.tsLoaded = 100;

      // 执行导出
      await table2excel.export(fileName);
    },

    // JSON 导出 Excel
    async excel(data, fileName) {
      if (!data || !Array.isArray(data) || !data.length) throw "数据不存在";
      const { columns } = this.$props;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Sheet1");

      // 创建表头
      sheet.columns = [...columns].map(set => {
        return { header: set.title, key: set.key };
      });

      // 拆分单次处理 500 条数据，避免 ExcelJS 导致浏览器崩溃
      const ts = 500;
      const steps = Math.ceil(data.length / ts);
      this.tsTotal = steps;

      for (let step = 0; step < steps; step++) {
        // 提取指定长度的数据
        const _data = data.slice(step * ts, step * ts + ts);

        _data.forEach(row => {
          const _row = { ...row };

          columns.forEach((set, cellIndex) => {
            const { key } = set;

            // 取的对应行的字段值
            let value = row[key];

            // 额外的处理
            if (set.format && set.format instanceof Function) {
              value = set.format(value, row);
            }

            // 简单数字格式化
            if (utils.isNum(value)) {
              value = Number(value);
            }

            // 金额
            if (utils.isAmount(value)) {
              // 注意，单元格的下标是从 1 开始
              sheet.getColumn(cellIndex + 1).numFmt = "#,##0.00";
              value = Number(`${value}`.replace(/,/g, ""));
            }

            _row[key] = utils.hack(value, key, this.$props.hacks);
          });

          sheet.addRow(_row);
        });

        // 更新进度
        this.tsLoaded += 1;
      }

      const buffer = await workbook.xlsx.writeBuffer();

      await FileSaver.saveAs(new Blob([buffer]), fileName);
    },

    // 从远程拉取数据并导出，适合大数据表格
    async lgExcel(api, fileName) {
      if (!api || api instanceof Function === false) throw "无效的接口";

      const {
        params,
        columns,
        limit,
        max,
        reqPageNo,
        reqPageSize,
        resTotal,
        resData
      } = this.$props;

      // 初始化数据总数（同时会填充首页数据）
      let _params = Object.assign(params || {}, {
        [reqPageNo]: 1,
        [reqPageSize]: limit
      });

      // 请求首页数据
      const refer = await api({
        ..._params,
        [reqPageSize]: 1
      });

      if (!refer || !refer[resTotal] || +refer[resTotal] === 0)
        throw "没有数据可以导出";

      // 单次导出数据量过大
      if (max && refer[resTotal] >= max)
        throw "导出数据量过大，请调整数据查询条件！";

      // 更新分页配置
      this.tsTotal = Math.ceil(refer[resTotal] / limit);
      console.log(`共 ${this.tsTotal} 个分片`);

      // 待拼接的 Blob 数据
      // 此处不需要使用 json 处理数据
      // 因为某些场景下会出现多列同名的情况，比如：
      // 地区|融资金额|较上月增长|进件笔数|较上月增长
      // 上面的表头出现了 2 个 较上月增长 标题，后者会覆盖前者
      // 所以，下面按行拼接数据

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Sheet1");

      // 创建表头
      sheet.columns = [...columns].map(set => {
        return { header: set.title, key: set.key };
      });

      // 加载全部数据
      for (let i = 0; i < this.tsTotal; i++) {
        await (async () => {
          if (!this.exporting) return true;
          const _data = await api({
            ..._params,
            [reqPageNo]: i + 1
          });

          // 不再含有数据时，导出结束
          if (!Array.isArray(_data[resData])) {
            this.tsLoaded = +this.tsTotal;
            return true;
          }

          _data[resData].forEach(row => {
            const _col = { ...row };

            columns.forEach((set, cellIndex) => {
              const { key } = set;

              // 取的对应行的字段值
              let value = row[key];

              // 额外的处理
              if (set.format && set.format instanceof Function) {
                value = set.format(value, row);
              }

              // 简单数字格式化
              if (utils.isNum(value)) {
                value = Number(value);
              }

              // 金额
              if (utils.isAmount(value)) {
                // 注意，单元格的下标是从 1 开始
                sheet.getColumn(cellIndex + 1).numFmt = "#,##0.00";
                value = Number(`${value}`.replace(/,/g, ""));
              }

              _col[key] = utils.hack(value, key, this.$props.hacks);
            });

            sheet.addRow(_col);
          });

          // 更新进度
          this.tsLoaded += 1;
        })();
      }

      // 导出被取消
      if (!this.exporting) return;

      const buffer = await workbook.xlsx.writeBuffer();

      await FileSaver.saveAs(new Blob([buffer]), fileName);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
