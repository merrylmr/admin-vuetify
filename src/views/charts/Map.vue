<template>
  <div>
    <div>
      <h1>中国人口</h1>
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
      myChart: null
    }
  },
  methods: {
    async initMap() {
      const chartDom = document.getElementById('map');
      const myChart = this.$echarts.init(chartDom);
      myChart.showLoading();
      const geoJson = await this.getGeoJSONData();
      this.$echarts.registerMap('ZH', geoJson);

      const dataList = await this.getPeopleInfo();
      const options = this.setOptions(dataList);
      myChart.setOption(options);
      myChart.hideLoading();
      this.myChart = myChart;

      myChart.on('click', (e) => {
        console.log('myChart e', e, e.data);
        if (e.data) {
          // this.changeArea(e.data)
        }
      })
    },
    async changeArea(data) {
      if (this.myChart) {
        this.myChart.clear();
      }
      console.log('changeArea----1', data);
      this.myChart && this.myChart.showLoading();
      const geoJson = await this.getGeoJSONData(data.adCode);
      this.$echarts.registerMap('ZH', geoJson);
      const dataList = await this.getPeopleInfo();
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
    async getPeopleInfo() {
      try {
        const res = await peopleInfo();
        console.log('peopleInfo', res);
        return res;
      } catch (err) {
        console.error('获取口信息出错', err)
      }
    },

    setOptions(data) {
      let options = mapOptions('ZH');
      data.forEach(item => {
        options.series[0].data.push({
          name: item.name,
          value: item.value || 0,
          adCode: item.adCode
        })
      })
      return options;
    },
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
  //border: 2px solid #2994cd;
}
</style>