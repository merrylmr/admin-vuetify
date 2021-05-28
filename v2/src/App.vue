<template>
  <div id="app">
    <router-view></router-view>
<!--    <div class="list">-->
<!--      <div class="item"-->
<!--           v-for="(value,key) in list"-->
<!--           :key="key">-->
<!--        {{ value }}-{{key}}-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {},
  data() {
    return {
      list: {
        btc: [],
        ETH: []
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
