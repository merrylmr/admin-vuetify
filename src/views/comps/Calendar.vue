<template>
  <div>calender</div>
</template>
<script>
export default {
  name: 'calender',
  data() {
    return {}
  },
  methods: {
    getCurTime() {
      const date = Date.now();
      const year = date.getFullYear()
      const month = date.getMonth() + 1;
      const day = date.getDate();

    }
  },
  mounted() {

  }
}
</script>