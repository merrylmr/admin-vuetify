<template>
  <div class="ma-4">
    <v-btn @click="toPage">TO page C</v-btn>
    <v-btn @click="goBack">back</v-btn>
    <div class="text-h4">page B</div>
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
        name: 'c'
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>