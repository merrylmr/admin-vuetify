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
import {peopleInfo, posInfo} from '@/api/index.js'
import {mapOptions} from './options.js'

const nameMap = {
  '100000': '中国人口',
  '510000': '中国-四川人口',
  '510100': '中国-四川-成都人口',
}
export default {
  name: 'map',
  data() {
    return {
      myChart: null,
      currentCode: '100000',
      chinaCode: '100000',
      sichuanCode: '510000',
      cdCode: '510100',
      // 用来记录当前处于区域层级：1表示全国2：省级别 3.市
      level: 1
    }
  },
  computed: {
    isGoBack() {
      return this.currentCode !== this.chinaCode
    },
    title() {
      const title = nameMap[this.currentCode];
      return title || '中国人口'
    },
    isCountry() {
      return this.currentCode === this.chinaCode
    }
  },
  methods: {
    async initMap() {
      const chartDom = document.getElementById('map');
      const myChart = this.$echarts.init(chartDom);
      await this.drawMapWithGeoJSON();
      this.drawMapWithData();
      this.myChart = myChart;

      myChart.on('click', (e) => {
        console.log('myChart e', e.componentType, e.data.adCode);
        if (e.componentType === 'markPoint') {
          this.changeArea(e.data);
          this.level++;
          this.$router.push({
            name: 'map',
            query: {
              pCode: this.currentCode
            }
          })
        }
      })
    },
    async drawMapWithGeoJSON(code = this.chinaCode) {
      if (this.myChart) {
        this.myChart.clear();
      }
      this.myChart && this.myChart.showLoading();
      const geoJson = await this.getGeoJSONData(code);
      this.$echarts.registerMap('ZH', geoJson);
    },
    async changeArea(data) {
      await this.drawMapWithGeoJSON(data.adCode)
      this.drawMapWithData(data.adCode);
      // TODO:目前仅支持四川、成都市
      this.currentCode = data.adCode;
    },
    drawMapWithData(code = this.chinaCode) {
      console.log('drawMapWithData start');
      Promise.all([this.getPeopleInfo(code), this.getPosInfo(code)]).then(async (res) => {
        console.log('drawMapWithData res', res);
        const dataList = res[0]
        const makerPoints = res[1]
        const options = this.setOptions(dataList, makerPoints);
        this.myChart.setOption(options);
        this.myChart.hideLoading();
      })
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

    setOptions(data, makerPoints) {
      let options = mapOptions('ZH');
      let maxValue = 0,
          minValue = Infinity
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

      if (makerPoints && makerPoints.length) {
        makerPoints.forEach(item => {
          options.series[0].markPoint.data.push({
            name: item.name,
            adCode: item.adCode,
            coord: [item.longitude, item.latitude]
          })
        })
      }
      return options;
    },

    // 获取城市的经纬度信息
    async getPosInfo(code) {
      try {
        const res = await posInfo({
          code: code
        });
        console.log('res', res);
        return res || []
      } catch (err) {
        console.error(err);
      }
    },
    goBack() {
      this.level--;
      const queryCode = this.$route.query.pCode;
      let adCode = queryCode || this.chinaCode;

      if (this.level === 1) {
        adCode = this.chinaCode
        this.$router.push({
          name: 'map',
          query: {
            pCode: ''
          }
        })
      }

      // 市-->省-->全国
      this.changeArea({adCode: adCode})
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