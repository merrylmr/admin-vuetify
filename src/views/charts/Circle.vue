<template>
  <div class="ma-4">
    <div class="text-h4">canvas绘制弧形</div>
    <div>
      <canvas class="canvas" id="canvas"></canvas>
    </div>
    <div class="canvas">
      <SvgCircle
          color="rgba(0,0,0,0.4)"
          :stroke-width="4"></SvgCircle>
    </div>
  </div>
</template>

<script>
import SvgCircle from "./SvgCircle";

export default {
  props: {
    strokeWidth: {
      type: Number,
      default: 5
    },
    lineCap: {
      type: String,
      default: 'round'
    },
    type: {
      type: String,
      default: 'dashboard' // circle / dashboard
    },
    offsetRad: {
      type: Number,
      default: Math.PI / 12
    },
    color: {
      type: [String, Array],
      default: '#FF5924'
    },
    percent: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      baseRad: Math.PI * 2
    }
  },
  components: {SvgCircle},
  methods: {
    getPixelRatio(context) {
      // backingStore 获取浏览器像素和真实像素比
      // 这个属性大部分浏览器都已废弃
      const backingStore =
          context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio ||
          1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
    getCanvasBase(selector) {
      const canvas = this.$el.querySelector(`#${selector}`);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      const ctx = canvas.getContext('2d');

      const ratio = this.getPixelRatio(ctx);

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      const circle = {
        r: canvas.width / 2 - 2 * this.strokeWidth,
        x: canvas.width / 2,
        y: (canvas.height / 2 + 2)
      }

      return {ctx, canvas, pos: circle}
    },

    drawProgress(ctx,
                 options = {
                   percent: 0,
                   x: 0,
                   y: 0,
                   r: 20,
                   offsetRad: Math.PI / 12
                 }) {

      ctx.beginPath();
      const ratio = this.getPixelRatio(ctx);
      ctx.lineCap = 'round';
      ctx.lineWidth = this.strokeWidth * ratio;

      if (typeof options.color === 'string') {
        ctx.strokeStyle = options.color;
      } else {
        const grad = ctx.createLinearGradient(0, 0, 300, 0);
        grad.addColorStop(0, options.color[0]);
        grad.addColorStop(1, options.color[1]);
        ctx.strokeStyle = grad;
      }


      ctx.arc(
          options.x,
          options.y,
          options.r,
          this.baseRad + options.offsetRad,
          ((this.baseRad - options.offsetRad * 2) * (options.percent / 100)) + (this.baseRad + options.offsetRad),
          false);
      ctx.stroke();
      ctx.closePath();
    },

    drawDot() {

    },
    getBaseRad() {
      if (this.type === 'dashboard') {
        return Math.PI
      } else {
        return Math.PI * 2
      }
    },
  },
  mounted() {
    this.$nextTick(() => {

      const {ctx, pos} = this.getCanvasBase('canvas');
      // base
      this.baseRad = this.getBaseRad();

      this.drawProgress(ctx, {
        type: this.type,
        percent: 100,
        x: pos.x,
        y: pos.y,
        r: pos.r,
        color: 'rgb(229, 233, 242)',
        offsetRad: 0
      })

      this.drawProgress(ctx,
          {
            percent: this.percent,
            x: pos.x,
            y: pos.y,
            r: pos.r,
            color: this.color,
            lineCap: this.lineCap,
            offsetRad: 0
          })
    })
  }
}
</script>

<style scoped lang="scss">
.canvas {
  width: 200px;
  height: 200px;
}
</style>