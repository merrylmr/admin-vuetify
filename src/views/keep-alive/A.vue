<template>
  <div class="ma-4">
    <v-btn color="primary" @click="toPage">TO page B</v-btn>
    <div class="text-h4">page A</div>
    <div class="mt-4">{{ random }}</div>
  </div>
</template>

<script>
export default {
  name: 'a',
  data() {
    return {
      random: Math.random()
    }
  },
  methods: {
    toPage() {
      this.$router.push({
        name: 'b'
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>