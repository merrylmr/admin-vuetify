<template>
  <div class="sheet2">
    <div id="luckysheet"
         style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
  </div>
</template>

<script>
export default {
  name: 'sheet2',
  methods: {
    init() {
      const options = {
        container: 'luckysheet',
        title: '', // 设定表格名称
        lang: 'zh', // 设定表格语言
        showinfobar: false,
        showtoolbar: true,
        showtoolbarConfig: {
          image: false,
          print: false,
        },
        sheetRightClickConfig: {
          delete: false, // 删除
          copy: false, // 复制
          rename: false, //重命名
          color: false, //更改颜色
          hide: false, //隐藏，取消隐藏
          move: false, //向左移，向右移
        },
        data: [
          {
            "name": "Sheet1",
            color: "",
            "status": "1",
            "order": "0",
            "data": [],
            "config": {},
            "index": 0,
            celldata: [{
              "r": 0,
              "c": 0,
              "v": {
                ct: {fa: "General", t: "g"},
                m: "value1",
                v: "value1"
              }
            }, {
              "r": 0,
              "c": 1,
              "v": {
                ct: {fa: "General", t: "g"},
                m: "value2",
                v: "value2"
              }
            }]
          },]
      }
      const instance = window.luckysheet.create(options);
      console.log('instance', instance)
      console.log('luckysheet', window.luckysheet.getAllSheets())
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  }
}
</script>