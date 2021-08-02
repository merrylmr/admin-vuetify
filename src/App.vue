<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {},
  data() {
    return {
      timerId: null,
    }
  },
  methods: {
    interValNotify() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        window.alert('该上厕所啦！');
      }, 1000 * 60 * 30)
    }
  },
  mounted() {
    // this.interValNotify()
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
