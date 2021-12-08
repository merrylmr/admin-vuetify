<template>
  <div class="sheet">
    <div class="custom-toolbar">
      <div class="toolbar-item">
        <v-icon v-text="'mdi-apps'"></v-icon>
        <span>数据</span>
      </div>
      <div class="toolbar-item">
        <v-icon v-text="'mdi-function'"></v-icon>
        <span>函数</span>
      </div>
    </div>
    <v-row>
      <v-col cols="6">
        <v-text-field
            :label="cell.name"
            v-model="cell.value"
            @change="changeHandle"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-btn small>函数</v-btn>
      </v-col>
    </v-row>
    <div id="spreadsheet"></div>
  </div>
</template>


<script>
import jspreadsheet from 'jspreadsheet-ce/dist/index'
import 'jspreadsheet-ce/dist/jspreadsheet.css'
// import 'jspreadsheet-ce/dist/jspreadsheet.datatables.css'
// import 'jspreadsheet-ce/dist/jspreadsheet.theme.css'
const TableHeader = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
export default {
  name: 'sheet',
  data() {
    return {
      cell: {
        name: '',
        value: ''
      },
      table: null
    }
  },
  methods: {
    // 回显到表单对应的单元格
    changeHandle() {
      this.table.setValue(this.cell.name, this.cell.value)
    },
    init() {
      const _this = this;


      function selectionActive(instance, x1, y1, x2, y2, origin) {
        console.log('instance, x1, y1, x2, y2, origin', instance, x1, y1, x2, y2, origin)
        const cellName1 = jspreadsheet.getColumnNameFromId([x1, y1]);
        console.log('cellName1', cellName1)
        const value = _this.table.getValue(cellName1)
        console.log('value:', value)
        _this.cell.name = cellName1;
        _this.cell.value = value;
      }

      this.table = jspreadsheet(document.getElementById('spreadsheet'), {
        data: [[]],
        minDimensions: [26, 10],
        // toolbar: [
        //   {
        //     type: 'i',
        //     content: 'undo',
        //     onclick: function () {
        //       table.undo();
        //     }
        //   },
        //   {
        //     type: 'i',
        //     content: 'redo',
        //     onclick: function () {
        //       table.redo();
        //     }
        //   },
        //   {
        //     type: 'i',
        //     content: 'save',
        //     onclick: function () {
        //       table.download();
        //     }
        //   },
        //   {
        //     type: 'select',
        //     k: 'font-family',
        //     v: ['Arial', 'Verdana']
        //   },
        //   {
        //     type: 'select',
        //     k: 'font-size',
        //     v: ['9px', '10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px']
        //   },
        //   {
        //     type: 'i',
        //     content: 'format_align_left',
        //     k: 'text-align',
        //     v: 'left'
        //   },
        //   {
        //     type: 'i',
        //     content: 'format_align_center',
        //     k: 'text-align',
        //     v: 'center'
        //   },
        //   {
        //     type: 'i',
        //     content: 'format_align_right',
        //     k: 'text-align',
        //     v: 'right'
        //   },
        //   {
        //     type: 'i',
        //     content: 'format_bold',
        //     k: 'font-weight',
        //     v: 'bold'
        //   },
        //   {
        //     type: 'color',
        //     content: 'format_color_text',
        //     k: 'color'
        //   },
        //   {
        //     type: 'color',
        //     content: 'format_color_fill',
        //     k: 'background-color'
        //   },
        // ],
        columnSorting: false,
        defaultColWidth: 100,
        allowExport: false,
        // fullscreen: true,
        contextMenu: function (obj, x, y) {
          // 这两个组合可以实现合并单元格
          let items = [
            {
              title: '在左侧插入一列',
              onclick: () => {
                obj.insertColumn(1, parseInt(x), 1);
              }
            },
            {
              title: '在右侧插入一列',
              onclick: () => {
                obj.insertColumn(1, parseInt(x), 0);
              }
            },
            {
              title: '删除选中列',
              onclick: () => {
                obj.deleteColumn(obj.getSelectedColumns().length ? undefined : parseInt(x));
              }
            },
            {
              title: '复制',
              onclick: () => {
                console.log('复制')
              }
            },
          ];

          if (y !== null) {
            items.unshift(
                ...[
                  {
                    title: '在上方插入一行',
                    onclick: function () {
                      obj.insertRow(1, parseInt(y), 1);
                    }
                  },
                  {
                    title: '在下方插入一行',
                    onclick: function () {
                      obj.insertRow(1, parseInt(y));
                    }
                  },
                  {
                    title: '删除选中行',
                    onclick: function () {
                      obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                    }
                  },
                ]
            )

            const selectedColumns = obj.getSelectedColumns();
            const selectedRows = obj.getSelectedRows();

            const colSpan = selectedColumns.length;
            const rowSpan = selectedRows.length;
            const startRow = Number(selectedRows[0].dataset['y']) + 1;
            const startPos = TableHeader[selectedColumns[0]] + startRow;

            console.log('selectedColumns[colSpan - 1]', selectedColumns, colSpan)

            const allMerge = obj.getMerge();

            const merges = _this.mergeInSelectedArea(TableHeader[selectedColumns[0]], TableHeader[selectedColumns[colSpan - 1]], allMerge)


            let hasMerged = false;

            if (merges && merges.length) {
              console.log('merge', merges);


              hasMerged = !!merges;
            }
            // 选中了两个以上才“显示合并单元格”
            if (!hasMerged) {
              if (colSpan > 1 || rowSpan > 1) {
                items.push({
                  title: '合并单元格',
                  onclick: () => {
                    obj.setMerge(startPos, colSpan, rowSpan)
                  }
                })
              }
            } else {
              items.push({
                title: '取消合并单元格',
                onclick: () => {
                  merges.forEach(item => {
                    obj.removeMerge(item)
                  })
                }
              })
            }
          }
          return items;
        },
        onselection: selectionActive
      });
    },
    // 合并的单元格是否在选中的区域
    mergeInSelectedArea(startRange, endRange, merges) {
      console.log('startRange', startRange)
      console.log('endRange', endRange)
      console.log('merges', merges)

      const startIndex = TableHeader.findIndex(item => {
        return item === startRange;
      })

      const endIndex = TableHeader.findIndex(item => {
        return item === endRange;
      })

      const range = TableHeader.slice(startIndex, endIndex)
      console.log('range:', range);

      let inRangeMerge = []

      for (let key in merges) {
        const oneName = key.substring(0, 1);
        console.log('oneName', oneName);
        if (range.includes(oneName)) {
          inRangeMerge.push(key)
        }
      }
      console.log('inRangeMerge', inRangeMerge)
      return inRangeMerge
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })

  }
}
</script>


<style scoped lang="scss">
.custom-toolbar {
  @include flex();
  border-bottom: 1px solid #eee;
  background: #f9fafb;
}

.toolbar-item {
  padding: 10px 10px;
  cursor: pointer;
}
</style>