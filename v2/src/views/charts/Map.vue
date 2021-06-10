<template>
  <div>
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import axios from 'axios'

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

      const options = {
        visualMap: {
          min: 800,
          max: 50000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: '人口密度',
            type: 'map',
            mapType: 'ZH',
            label: {
              show: true
            },
            data: []
          }
        ]
      }
      myChart.setOption(options);
      myChart.hideLoading();
    },
    async getGeoJSONData() {
      try {
        const res = await axios.get('/json/100000.json');

        return res.data;
      } catch (err) {
        console.error('获取geoJson数据出错', err)
      }
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
  height: 800px;
  border: 1px solid red;
}
</style>