<template>
  <div class="import-export-wrap el-button slic-btn-theme3 el-button--primary el-button--small">
    <el-button type="primary" size="small" @click="doImport()" v-if="isImport">导入</el-button>
    <el-dropdown @command="handleCommand" >
      <el-button type="primary" size="small" class="slic-btn-theme3">导出
        <i class="el-icon-caret-bottom el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="all">全部</el-dropdown-item>
        <el-dropdown-item command="select">已选项</el-dropdown-item>
        <el-dropdown-item command="current">当前页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!--<el-button type="primary" size="small" @click="doExport()">导出</el-button>-->
    <input type="file" multiple="false" id="sheetjs-input" accept="SheetJSFT" @change="onchange" style="display: none;" />
    <button type="button" id="expor-table" style="display: none;" @click="onexport"></button>
    <div id="exportTable"></div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ElButton from '../../node_modules/element-ui/packages/button/src/button'
import ElDialog from '../../node_modules/element-ui/packages/dialog/src/component'

function s2ab(s) {
  if (typeof ArrayBuffer !== 'undefined') {
    let buf = new ArrayBuffer(s.length)
    let view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  } else {
    let buf = new Array(s.length)
    for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
    return buf
  }
}

export default {
  components: {
    ElDialog,
    ElButton
  },
  name: 'sl-button-export',
  props: ['fileName', 'header', 'exportData', 'isImport'],
  methods: {
    handleCommand(command) {
      this.$emit('goToExp', command);
    },
    doImport() {
      const imp = document.getElementById('sheetjs-input')
      imp.click()
    },
    doExport() {
      const exp = document.getElementById('expor-table')
      setTimeout(function() {
        exp.click()
      }, 500)

    },
    onchange: function(evt) {
      let _this = this
      let file
      let files = evt.target.files
      let tableHeader = []
      tableHeader = this.header

      if (!files || files.length === 0) return

      file = files[0]

      let reader = new FileReader()
      reader.onload = function(e) {
        // pre-process data
        let binary = ''
        let bytes = new Uint8Array(e.target.result)
        let length = bytes.byteLength
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }

        /* read workbook */
        let wb = XLSX.read(binary, { type: 'binary' })

        /* grab first sheet */
        let wsname = wb.SheetNames[0]

        let ws = wb.Sheets[wsname]

        console.log('ws==', ws)
        console.log('ws2==', XLSX.utils.sheet_to_json(ws))
        console.log('ws3==', XLSX.utils.sheet_to_row_object_array(ws))

        let excelObj = XLSX.utils.sheet_to_row_object_array(ws)
        let resultArr = []
        for (let i = 0; i < excelObj.length; i++) {
          let item = excelObj[i]
          let obj = {}
          for (let j = 0; j < tableHeader.length; j++) {
            let head = tableHeader[j]
            for (let param in item) {
              if (param === head.header) {
                obj[head.field] = item[param]
                break
              }
            }
          }

          resultArr.push(obj)
        }
        console.log('resultArr==', resultArr)
        _this.$emit('getResultArr', resultArr)

        /* generate HTML */
        // let HTML = XLSX.utils.sheet_to_html(ws)

        /* update table */
        // document.getElementById('out-table').innerHTML = HTML
        /* show export button */
        // document.getElementById('expor-table').style.visibility = 'visible'
      }

      reader.readAsArrayBuffer(file)
    },
    onexport: function(evt) {
        const _this = this;

      /* json转成sheet，再将sheet转为html */
      // console.log('this.exportData==', this.exportData);
      if (this.exportData.length === 0) {
        this.$message('没有要导出的数据！');
        return
      }

      let exportObj = this.exportData
      let tableHeader = this.header
      let resultArr = []
      for (let i = 0; i < exportObj.length; i++) {
        let item = exportObj[i]
        let obj = {}
        for (let j = 0; j < tableHeader.length; j++) {
          let head = tableHeader[j]
          for (let param in item) {
            if (param === head.field) {
              obj[head.name] = item[param]
              break
            }
          }
        }

        resultArr.push(obj)
      }


      let jsonToSheet = XLSX.utils.json_to_sheet(resultArr)

      let sheetToHtml = XLSX.utils.sheet_to_html(jsonToSheet)

       /* let sheetToHtml =  '<table id="sheetjs">'
        +  '<tr><td>S</td><td>h</td><td>e</td><td>e</td><td>t</td><td>J</td><td>S</td></tr>'
         + '<tr><td>111111111111111111111111111</td><td>1*1</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>'
        +  '<tr><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>844444444444444444444444444444444444444444</td></tr>'
        +  '</table>';*/

      let expTable = document.getElementById('exportTable')
      expTable.innerHTML = sheetToHtml;



      /* generate workbook object from table */
      let wb = this.sheet_to_workbook(_this.parse_dom_table(expTable));


//        let formatData = XLSX.utils.format_cell(wb);
//      console.log(formatData)

        expTable.innerHTML = '';

      /* get binary string as output */
      let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

      /* force a download */
      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), this.fileName + '.xlsx')
    },

    parse_dom_table(table, _opts) {
        var DENSE = null;
    var opts = _opts || {};
    if(DENSE != null) opts.dense = DENSE;
    var ws = opts.dense ? ([]) : ({});
    var rows = table.getElementsByTagName('tr');
    var range = {s:{r:0,c:0},e:{r:rows.length - 1,c:0}};
    var merges = [], midx = 0;
    var R = 0, _C = 0, C = 0, RS = 0, CS = 0;
    for(; R < rows.length; ++R) {
        var row = rows[R];
        var elts = row.children;
        for(_C = C = 0; _C < elts.length; ++_C) {
            var elt = elts[_C], v = elts[_C].innerText || elts[_C].textContent;
            for(midx = 0; midx < merges.length; ++midx) {
                var m = merges[midx];
                if(m.s.c == C && m.s.r <= R && R <= m.e.r) { C = m.e.c+1; midx = -1; }
            }
          /* TODO: figure out how to extract nonstandard mso- style */
            CS = +elt.getAttribute("colspan") || 1;
            if((RS = +elt.getAttribute("rowspan"))>0 || CS>1) merges.push({s:{r:R,c:C},e:{r:R + (RS||1) - 1, c:C + CS - 1}});
            var o = {t:'s', v:v};
            if(v != null && v.length) {
//                if(!isNaN(Number(v))) o = {t:'n', v:Number(v)};
                /*if(!isNaN(fuzzydate(v).getDate())) {
                    o = ({t:'d', v:parseDate(v)});
                    if(!opts.cellDates) o = ({t:'n', v:datenum(o.v)});
                    o.z = opts.dateNF || SSF._table[14];
                }*/
            }
            if(opts.dense) { if(!ws[R]) ws[R] = []; ws[R][C] = o; }
            else ws[XLSX.utils.encode_cell({c:C, r:R})] = o;
            if(range.e.c < C) range.e.c = C;
            C += CS;
        }
    }
    ws['!merges'] = merges;
    ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
},
    sheet_to_workbook(sheet, opts) {
    var n = opts && opts.sheet ? opts.sheet : "Sheet1";
    var sheets = {}; sheets[n] = sheet;
    return { SheetNames: [n], Sheets: sheets };
}
  }
}

</script>

<style rel="stylesheet/css" lang="scss">
	.import-export-wrap {
			display: inline-block !important; 
			padding:0!important; 
			.el-dropdown {
				border-radius: 4px;
				
					.slic-btn-theme3 {
						  border-top-right-radius: 4px;
    					border-bottom-right-radius: 4px;
					}
			}
	
	}
</style>