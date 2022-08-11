import moment from "moment";

// Test
export const version = () => {
  console.log(
    `${"·".repeat(
      64
    )}\n⛄️ %cSCExcelExport Plugin %cV0.0.1\n%chttps://git.songcw.com/data/web/songcw-data-platform-manage\n${"·".repeat(
      64
    )}`,
    "color: #09f; font-weight:bold;",
    "color: #f90; font-weight:bold;",
    ""
  );
};

/**
 * 校验值是否为数字
 * @description 支持 正负整数、正负小数
 * @param {string} value 待校验的值
 * @param {boolean}
 */
export const isNum = value => {
  if (value == null) {
    return false;
  }
  var strValue = value.toString();
  return parseFloat(strValue).toString() === strValue;
};

/**
 * 校验值是否为金额千分位格式
 * @param {string} value 待校验的值
 * @param {boolean}
 */
export const isAmount = value =>
  /^((-)?\d+)((,\d+){1,})?(\.\d{2,4})$/.test(value);

/**
 * 暂停执行
 * @param {number} 暂停的描述
 * @returns {Promise}
 */
export const sleep = async time =>
  new Promise(resolve => setTimeout(resolve, time));

/**
 * 创建当前日期对应的时分秒字符串
 * @returns {string}
 */
export const timestamp = moment().format("YYYYMMDDHHmmss");

/**
 * 特殊列格式保留
 * @description 对单元格的值进行例行修正，特别是日期、数值、金额 等
 * `hacks` 可以指定需要修正的 key，比如：序列号、交易号 等；
 * 默认 2021-02-22 13:22:55、2021-02-22、13:22:55 和 10 位以上纯数字 会进行修正；
 * 长数字在 CSV 格式中会变为科学计数法，如：12E+；
 * 日期在单元格宽度不足的情况下会变为 ####-##-## 等格式；
 * @param { any } value 单元格的值
 * @param { string } key 该值对应的 key
 * @returns { any }
 */
export const hack = (value, key, hacks = []) => {
  return (key && Array.isArray(hacks) && hacks.includes(key)) 
    // ||
    // /\d{4}(-|\/)\d{2}(-|\/)\d{2}/g.test(value) ||
    // /\d{1,2}:\d{1,2}:\d{1,2}g/.test(value) ||
    // /\d{4}(-|\/)\d{2}(-|\/)\d{2}(\s+)\d{1,2}:\d{1,2}:\d{1,2}/g.test(value) ||
    // /\d\/\d/g.test(value) ||
    // /^\d{10,}/.test(value)
    ? `${value}\t`
    : value;
};
