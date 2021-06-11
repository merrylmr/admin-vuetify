<template>
  <div>
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
    return {}
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
    },
    // 获取geoJson数据
    async getGeoJSONData() {
      try {
        const res = await axios.get('/json/100000.json');
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
  border: 2px solid #2994cd;
}
</style>