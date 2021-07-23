<template>
  <div class="ele-progress">
    <svg viewBox="0 0 100 100">
      <path d="
        M 50 50
        m 0 -47
        a 47 47 0 1 1 0 94
        a 47 47 0 1 1 0 -94
        " stroke="#e5e9f2"
            :stroke-width="strokeWidth" fill="none" class="el-progress-circle__track"
            style="stroke-dasharray: 295.31px, 295.31px; stroke-dashoffset: 0px;"></path>
      <path d="
        M 50 50
        m 0 -47
        a 47 47 0 1 1 0 94
        a 47 47 0 1 1 0 -94
        "
            :stroke="color"
            fill="none"
            stroke-linecap="round"
            :stroke-width="strokeWidth"
            class="el-progress-circle__path"
            :style="dasharrayStyle"
            style=";
              stroke-dashoffset: 0px;
              transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;"></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'ele-progress',
  props: {
    strokeWidth: {
      type: Number,
      default: 6
    },
    color: {
      type: String,
      default: '#20a0ff'
    },
    strokeLinecap: {
      type: String,
      default: 'round'
    },
    percent: {
      type: Number,
      default: 70
    }
  },
  computed: {
    dasharrayStyle() {
      return {
        'stroke-dasharray': `${295.31 * this.percent / 100}px 295.31px`
      }
    }
  }

}
</script>