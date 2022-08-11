# sc-excel-export

> 颂车网 - 前端插件 - 表格 Excel 导出。

> 注意：**导出的 excel 不具备排版样式！**

## 安装

```bash
# 安装插件依赖
$ npm install git+http://git.songcw.com/front-end/packages/sc-excel-export.git
# 或
$ yarn add git+http://git.songcw.com/front-end/packages/sc-excel-export.git
```

在 src/main.js 中挂载插件：

```js
import Vue from "vue";

// 表格导出
import SCExcelExport from "sc-excel-export";
Vue.use(SCExcelExport);

new Vue({
el: "#app",
render: h => h(App)
});
```

## 用法

支持三种方式的表格导出：

- 导出 Dom 元素表格为 excel 表格；
- 导出 json 数据为 excel 表格；
- 远程分页加载数据并导出为 excel 表格；

## 导出 DOM 元素表格

> DOM 导出基于 table2excel.js，具体文档参考：<https://www.npmjs.com/package/table2excel.js>

DOM 导出适合那些自定义的表格，通常，这类表格结构比较复杂，比如：包含各种类型的单元格合并。

> 注意：静态表格导出数据达到 2000+ 时，浏览器性能会明显降低，这个值根据用户的电脑配置还会存在一定的差异。所以，当数据量较大时，建议使用远程搜索或静态数据导出。

导出 DOM 元素表格，至少需要两个参数：`file-name`、`dom`;

```html
<sc-excel-export
  file-name="表格"
  dom=".table"
  @on-success="handleExportSuccess"
  @on-error="handleExportError"
>
  <button>导出</button>
</sc-excel-export>

<table class="table">
  <thead>
    <tr>
      <th>姓名</th>
      <th>学号</th>
      <th>籍贯</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>赵四</td>
      <td>500230181878892</td>
      <td>黑龙江</td>
    </tr>
    <tr>
      <td>钱少</td>
      <td>458780051231233</td>
      <td>福建</td>
    </tr>
    <tr>
      <td>孙五</td>
      <td>12312312333222</td>
      <td>山西</td>
    </tr>
    <tr>
      <td>李二</td>
      <td>3332231223332111</td>
      <td>天津</td>
    </tr>
  </tbody>
</table>
```

脚本部分：

```js
export default {
	methods: {
		// 导出成功
		handleExportSuccess(params) {
			console.log(params);
			alert(params.message);
		},

		// 导出失败
		handleExportError(error) {
			alert(error);
		}
	}
};
```

这会原样导出表格内容。如果需要对单元格的值进行调整和处理，可以传入 `columns` 字段.

> columns 字段是通过 key/value 进行值的处理的，但 DOM 模式下，获取的数据不具有 key 属性。

> 提示：

## 导出 JSON 数据为 excel 表格

> JSON 导出基于 exceljs，具体文档参考：<https://www.npmjs.com/package/exceljs>

也可以使用 `data` + `column` 的方式导出表格。

```html
<sc-excel-export 
  file-name="表格" 
  :data="data" 
  :columns="columns"
  @on-success="handleExportSuccess"
  @on-error="handleExportError"
>
  <button>导出</button>
</sc-excel-export>

<el-table :data="data">
  <!-- element ui table -->
</el-table>
```

```js
export
default {
	data() {
		return {
			data: [{
				"id": 1,
				"username": "冯帅",
				"age": 41,
				"income": 2011800,
				"code": "2212327028541836",
				"region": "北京"
			}, {
				"id": 2,
				"username": "钱冠中",
				"age": 35,
				"income": 2011800,
				"code": "4436460475318775",
				"region": "陕西"
			}, {
				"id": 3,
				"username": "郑妙香",
				"age": 21,
				"income": 3012000,
				"code": "8040353421185137",
				"region": "福建"
			}, {
				"id": 4,
				"username": "周娜英",
				"age": 32,
				"income": 4012500,
				"code": "1516384362720551",
				"region": "上海"
			}, {
				"id": 5,
				"username": "冯龄",
				"age": 38,
				"income": -1011500,
				"code": "7820688747268065",
				"region": "陕西"
			}],
			columns: [{
				key: "id",
				title: "序号"
			}, {
				key: "username",
				title: "姓名",
				format(value) {
					// 脱敏处理
					return value;
				}
			}, {
				key: "age",
				title: "年龄"
			}, {
				key: "income",
				title: "额度",
				format(value) {
					// 千分位格式化
					return value;
				}
			}, {
				"key": "region",
				"title": "所在地"
			}]
		};
	},
  methods: {
		// 导出成功
		handleExportSuccess(params) {
			console.log(params);
			alert(params.message);
		},

		// 导出失败
		handleExportError(error) {
			alert(error);
		}
	}
};
```

## 接口数据导出

> 接口数据导出基于 jsonexport，具体文档参考：<https://www.npmjs.com/package/jsonexport>

```html
<sc-excel-export 
  file-name="表格" 
  :data="fetchData" 
  :columns="columns"
  @on-success="handleExportSuccess"
  @on-error="handleExportError"
>
  <button>导出</button>
</sc-excel-export>

<el-table :data="data">
  <!-- element ui table -->
</el-table>
```

使用接口方式导出数据时，给定的 `data` 参数必须是一个 `Promise Function`，同时，该接口接收一个对象参数，对象参数混合了 查询参数和分页参数。如果我们的接口不支持类似的参数，则需要手动扩展一个 `Promise` 方法，例如：

```js
// api.js


// 真实接口
// 该接口接收多个参数，并返回一组数据
// 其中 pageNo 为当前页码、pageSize 为每页显示数据条数、options 为查询条件、options 为 axios 的更多配置
export const ApiGetData = async(pageNo, pageSize, parmas = {}, options = {}) => {
  const res = await axios.post(`http://127.0.0.1:3000/data?pageNo=${pageNo}&pageSize=${pageSize}`, parmas, options);

  // 接口需要返回 数据总数和当页数据列表
  if(!res || !res.data) return { list: [], total: 0 };
  
  const { list, total } = res.data;
  return {
    list,
    data,
  };
};

// 表格导出使用的 data 接口
// 由于导出组件只使用一个参数调用，而上面的接口需要三个参数，随意，为了适配导出插件，我们需要再定义一个方法（如果你的接口本身也是接收一个参数，那再好不过了）
export const ExcelExportData = async (params = {}) => {
  // 合并参数
  const _params = {
    username: null,
    createAt: null,
    pageNo: 1,
    pageSize: 20,
    ...params
  };

  const filtter = {};
  ['username', 'createAt'].forEach(key => {
    if(_params[key]) {
      filtter[key] = _params[key];
    }
  });

  const data = await ApiGetData(_params.pageNo, _params.pageSize, filtter, {
    headers: {
      test: 'any'
    }
  });

  return data;
}
```

在上面的代码中，我们需要注意几个特殊的属性：

- `pageNo` 和 `pageSize`：导出插件默认使用的是 `pageNo` / `pageSize`，如果你的参数不一样，可使用 `reqPageNo` 和 `reqPageSize` 重新指定；
- `list` 和 `total`：导出插件默认使用 `list` 和 `total` 作为响应数据的解析字段，如果你的参数不一样，可使用 `resData` 和 `resTotal` 重新指定；

继续完成接口导出的演示：

```js
import { ExcelExportData } from './api.js';

export default {
  data() {
    return {
      ExcelExportData,
      columns: [] // 导出表头配置请参考上文
    };
  },
  methods: {
		// 导出成功
		handleExportSuccess(params) {
			console.log(params);
			alert(params.message);
		},

		// 导出失败
		handleExportError(error) {
			alert(error);
		}
	}
};
```

修改 html 部分：

```html
<sc-excel-export 
  file-name="表格" 
  :data="ExcelExportData" 
  :columns="columns"
  @on-success="handleExportSuccess"
  @on-error="handleExportError"
>
  <button>导出</button>
</sc-excel-export>
```

## props 参数

> 注意：当 `data` 参数为一个接口请求时，需要返回一个 `Promise`;

|参数|说明|类型|可选值|默认值|
|:--|:--|:--|:--|:--|
|fileName|【必须】保存的文件名| string|-|-|
|timestamp|文件名是否添加时间标记后缀| boolean|true/false|true|
|data|数据源|null/Array/Function|-|-|
|columns|表头配置|Array|-|[]|
|dom|指定的 table 元素选择器|string|-|-|
|hacks|排除数值保留的 key 集合|Array|-|[]|
|limit|远程分页加载数据时，每次请求的数据条数|number|-|5000|
|max|允许的最大导出条数|number| -| 1500000|
|params|远程请求数据时，携带的参数| Object|-|-|
|reqPageNo|远程请求时，当前页码的参数| string|-|pageNo|
|reqPageSize|远程请求时，每页获取数据条数的参数|string|-|pageSize |
|resTotal|远程响应数据中，数据总条数的字段名| string|-|total|
|resData|远程响应数据中，数据列表的字段名|string|-|list|
|cancellable|是否可取消|boolean|true/false|true|
|disabled|是否禁用|boolean|true/false|false|

## columns 属性

columns 是一个数组格式的配置，每个下标定义一个字段，即表头，单个字段支持以下属性：

> column 数据一般是动态传入，当涉及到权限列导出时，为了解耦，我们应该在创建 column 时定义好导出的字段，比如使用 Vue 的 `computed` 衍生出一份动态的 columns 数据。

|参数|说明|类型|可选值|默认值|
|:--|:--|:--|:--|:--|
|title|必须，表头名|string|-|-|
|key|必须，数据取值|string|-|-|
|numFmt|指定单元格格式，仅 CSV 格式有效|string|'#,##0.00'|-|
|format|数据格式化|function|-|-|
|width|单元格宽度，仅 JSON 静态数据有效|number|-|-|

## 事件

|事件名|说明|参数|备注|
|:--|:--|:--|:--|
|on-success|导出成功时|data|详细参数参考下文《导出成功回调数据》|
|on-error|导出失败时|error|消息字符串可以直接用于输出|
|on-cancel|导出被取消时|-|-|

## 导出成功回调数据

|参数|说明|类型|示例|
|:--|:--|:--|:--|
|name|传入的文件名|string|财务对账表|
|saveName|存储的文件名|string|财务对账表-20210222133558.xsls|
|message|提示消息|string|财务对账表导出成功|
|takeTime|耗时(毫秒)|number|1600|

## 依赖文档

- [table2excel.js](https://www.npmjs.com/package/table2excel.js)
- [jsonexport](https://www.npmjs.com/package/jsonexport)
- [exceljs](https://www.npmjs.com/package/exceljs)

## 关于

颂车网 © 前端团队 技术支持
