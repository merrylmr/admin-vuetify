<template>
  <div>
    <div class="ma-4 d-flex justify-space-between">
      <div class="text-h4">{{title}}
        <span class="text-sm-body-2">（单位：万）</span>
      </div>
      <v-btn
          v-show="isGoBack"
          @click="goBack"
      >
        返回上一级
      </v-btn>
    </div>
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import axios from 'axios'
import {peopleInfo} from '@/api/index.js'
import {mapOptions} from './options.js'

export default {
  name: 'map',
  data() {
    return {
      myChart: null,
      currentCode: '100000',
      chinaCode: '100000'
    }
  },
  computed: {
    isGoBack() {
      return this.currentCode !== this.chinaCode
    },
    title() {
      if (this.currentCode === this.chinaCode) {
        return '中国人口'
      } else {
        return '中国-四川人口'
      }
    }
  },
  methods: {
    async initMap() {
      const chartDom = document.getElementById('map');
      const myChart = this.$echarts.init(chartDom);
      myChart.showLoading();
      const geoJson = await this.getGeoJSONData();
      this.$echarts.registerMap('ZH', geoJson);

      const dataList = await this.getPeopleInfo(this.chinaCode);
      const options = this.setOptions(dataList);
      myChart.setOption(options);
      myChart.hideLoading();
      this.myChart = myChart;

      myChart.on('click', (e) => {
        console.log('myChart e', e, e.data);
        if (e.data) {
          // TODO:目前仅支持四川
          this.currentCode = '510000';
          this.changeArea(e.data)
        }
      })
    },
    async changeArea(data) {
      if (this.myChart) {
        this.myChart.clear();
      }
      console.log('changeArea----1', data);
      this.myChart && this.myChart.showLoading();
      const geoJson = await this.getGeoJSONData(this.currentCode);
      this.$echarts.registerMap('ZH', geoJson);
      const dataList = await this.getPeopleInfo(this.currentCode);
      const options = this.setOptions(dataList);
      this.myChart.setOption(options);
      this.myChart.hideLoading();
    },
    // 获取geoJson数据
    async getGeoJSONData(code = 100000) {
      try {
        const res = await axios.get(`/json/${code}.json`);
        return res;
      } catch (err) {
        console.error('获取geoJson数据出错', err)
      }
    },
    // 人口数据
    async getPeopleInfo(code) {
      try {
        const res = await peopleInfo({code: code});
        console.log('peopleInfo', res);
        return res;
      } catch (err) {
        console.error('获取口信息出错', err)
      }
    },

    setOptions(data) {
      let options = mapOptions('ZH');
      let maxValue = 0, minValue = Infinity
      data.forEach(item => {
        maxValue = item.value > maxValue ? item.value : maxValue;
        minValue = item.value < minValue ? item.value : minValue;
        options.series[0].data.push({
          name: item.name,
          value: item.value || 0,
          adCode: item.adCode
        })
      })
      console.log('max', maxValue, minValue)
      options.visualMap.min = minValue;
      options.visualMap.max = maxValue;
      return options;
    },
    goBack() {
      this.currentCode = this.chinaCode;
      this.changeArea()
    }
  },
  mounted() {
    this.initMap();
  }
}
</script>


<style scoped lang="scss">
.map {
  width: 100%;
  height: 100vh;
  min-height: 500px;
  //border: 2px solid #2994cd;
}
</style>