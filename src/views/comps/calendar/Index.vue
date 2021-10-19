<template>
  <div class="calendar-demo">
    <v-calendar-mobile
        :changeMode="true">
    </v-calendar-mobile>
  </div>
</template>

<script>

export default {
  name: 'calendar-demo',
  data() {
    return {}
  },
  methods: {},
  mounted() {
  }
}
</script>


<style scoped lang="scss">
.calendar-demo {
  height: 100vh;
  background-color: #eee;
}
</style>