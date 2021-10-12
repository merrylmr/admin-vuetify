<template>
  <div class="calendar-demo">
    <CalendarComp
        :changeMode="true"
    ></CalendarComp>
  </div>
</template>

<script>
import CalendarComp from '@/components/calendar/Index.vue'

export default {
  name: 'v-calendar',
  components: {CalendarComp}
}
</script>


<style scoped lang="scss">
.calendar-demo {
  height: 100vh;
  background-color: #eee;
}
</style>