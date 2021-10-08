<template>
  <div class="calendar-mobile">
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