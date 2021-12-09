<template>
  <div class="sheet">
    <div class="custom-toolbar">
      <div class="toolbar-item"
           @click="setTableDataHandle">
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
        <v-btn small
               @click="changeHeaderTypeHandle">表头类型
        </v-btn>
      </v-col>
    </v-row>
    <div id="spreadsheet"></div>
    <v-dialog
        v-model="dialog"
        width="500">
      <v-card>
        <!-- 选中了头部显示在头部的右侧 popover弹窗-->
        <div class="types">
          <div class="type-wrapper">
            <v-list flat>
              <v-list-item-group>
                <v-list-item
                    v-for="(item,index) in  columnTypes"
                    :key="index"
                    @click="changeColumnType(item)">{{ item.label }}
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
      </v-card>
    </v-dialog>
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
        value: '',
        index: 0
      },
      table: null,
      fakeData: {
        data: [
          {
            name: '张三1',
            mobile: '18381306244',
            idCard: '510902199511111111',
            job: '工作',
            gender: '男'
          },
          {
            name: '张三2',
            mobile: '18381306244',
            idCard: '510902199511111111',
            job: '工作',
            gender: '女'
          }
        ],
        totalNum: 0
      },
      dialog: false,
      columnTypes: [
        {
          label: '单选',
          value: 'radio'
        },
        {
          label: '复选',
          value: 'checkbox'
        },
        {
          label: '数字',
          value: 'numeric'
        },
        {
          label: '日期',
          value: 'calendar'
        },
        {
          label: '下拉框',
          value: 'dropdown'
        }
      ]
    }
  },
  methods: {
    // 改变头部类型
    changeColumnType(item) {
      console.log('changeColumnType', item, this.cell.index);
      this.table.options.columns[this.cell.index].type = item.value;
      this.dialog = false;
    },
    changeHeaderTypeHandle() {
      this.table.options.columns[4] = {
        source: ['男', '女'],
        width: 100,
        type: 'dropdown',
      }
    },
    // 给表单回填数据
    setTableDataHandle() {
      let columns = [];
      let data = []
      this.fakeData.data.forEach((item, index) => {
        let itemValue = []
        if (index === 0) {
          for (let key in item) {
            // 第一行的数据（默认未表头）
            columns.push(key)
            itemValue.push(item[key])
          }
          data.push(columns)
        } else {
          for (let key in item) {
            itemValue.push(item[key])
          }
        }
        data.push(itemValue)
      })
      console.log('data', data)
      this.table.setData(data);
    },
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
        _this.cell.index = x1
        //  TODO:如果是表头字段，显示设置表头类型
        // const tableData = _this.table.getJson();
        // console.log('tableData:', tableData)
      }

      this.table = jspreadsheet(document.getElementById('spreadsheet'), {
        data: [],
        minDimensions: [27, 100],
        columns: [],
        columnSorting: false,
        defaultColWidth: 100,
        allowExport: false,
        tableWidth: '100vw',
        tableOverflow: true,
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
    sheetClickEvent() {
      const dom = document.getElementById('spreadsheet');
      dom.addEventListener('click', (e) => {
        const className = Array.from(e.target.classList);
        console.log('e', e.target, className)

        if (className.includes('selected')) {
          // 位置偏差（点到箭头位置才显示弹窗）
          this.dialog = true;
        }
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
      this.sheetClickEvent();
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

.type-item {
  padding: 10px;
  cursor: pointer;
}

</style>

<style lang="scss">
thead {
  td {
    &.selected {
      &::after {
        content: '▼';
        position: absolute;
        right: 2px;
        top: 50%;
        transform: translate(0, -50%);
        color: #999;
      }
    }
  }
}
</style>