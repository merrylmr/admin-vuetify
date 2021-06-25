<template>
  <div class="ma-4">
    <v-btn @click="goBack">back</v-btn>
    <div class="text-h4">
      page C
    </div>
    <div class="mt-4">{{ random }}</div>
  </div>
</template>

<script>
export default {
  name: 'c',
  data() {
    return {
      random: Math.random()
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>