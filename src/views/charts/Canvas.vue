<template>
  <div class="map"></div>
</template>

<script>
import DrawGeoJson from '@/plugins/drawGeoJsonWithCanvas.js'
import jsonData from 'json/5101.json'

export default {
  name: 'map',
  data() {
    return {}
  },
  methods: {
    mapInit() {
      this.$nextTick(() => {
        const mapDom = document.body.querySelector('.map');
        new DrawGeoJson(mapDom, {
          geojson: jsonData
        })
      })
    }
  },
  mounted() {
    this.mapInit()
  }
}
</script>

<style scoped lang="scss">
.map {
  position: relative;
  width: 500px;
  height: 500px;
  border: 1px solid red;
}
</style>