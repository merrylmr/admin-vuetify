<template>
  <div class="word-could">
    <div id="container">
    </div>
  </div>
</template>

<script>
import WordCloud from 'wordcloud'

export default {
  name: 'word-could',

  data() {
    return {}
  },
  methods: {
    init() {
      const res = [
        {
          "labelId": "0fc81121-b373-44de-8a5b-99be4ca0eb0c",
          "name": "已做核酸检测",
          "num": 48959,
          "changNum": 5379
        },
        {
          "labelId": "69",
          "name": "外来务工",
          "num": 42045,
          "changNum": 5390
        },
        {
          "labelId": "ad1539bf-b90d-47d1-96aa-fac5f71e6364",
          "name": "新冠疫苗 接种完成",
          "num": 23293,
          "changNum": 542
        },
        {
          "labelId": "68394ac7-1da6-4ab8-b836-b00e9eec89cd",
          "name": "租住人口",
          "num": 13370,
          "changNum": 5385
        },
        {
          "labelId": null,
          "name": "优抚人员",
          "num": 8692,
          "changNum": 2
        },
        {
          "labelId": "61",
          "name": "社区志愿者",
          "num": 1217,
          "changNum": 0
        },
        {
          "labelId": null,
          "name": "社区人才",
          "num": 677,
          "changNum": 0
        },
        {
          "labelId": null,
          "name": "重点人员",
          "num": 135,
          "changNum": 0
        }
      ]

      const newArr = res.sort((a, b) => {
        return a.num - b.num
      })

      let x = [{...newArr[0], index: 2}]
      for (let i = 1; i < newArr.length; i++) {
        if (newArr[i].num > x[i - 1].num) {
          x.push({
            ...newArr[i],
            index: x[i - 1].index + 2
          })
        } else {
          x.push({
            ...newArr[i],
            index: x[i - 1].index
          })
        }
      }

      console.log('x:', x)
      let list = []
      // 数据从小到大排序
      x.forEach((item) => {
        const num = 14 + item.index * 2 <= 64 ? 14 + item.index * 2 : 64;
        console.log('num:', num)
        list.push([item.name, num])
      })

      WordCloud(document.getElementById('container'),
          {
            list: list,
            color: 'random-light',
            rotateRatio: 0,
            maxFontSize: 60,
            minFontSize: 14,
            gridSize: 20,
            drawOutOfBound: false,
            shrinkToFit: true,
            shape: 'square',
            fontWeight: 'bold'
          });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style scoped lang="scss">
#container {
  width: 400px;
  height: 300px;
  border: 1px solid red;
}
</style>
