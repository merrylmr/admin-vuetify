
<template>
  <div>
    <div>
      <div class="left-content scrollContainer" id="scrollContainer">
        <div class="section"
             id="section1">1
        </div>
        <div class="section"
             id="section2">2
        </div>
        <div class="section"
             id="section3">3
        </div>
        <!--        <div class="space" style="height:1000px"></div>-->
      </div>
      <div class="right-bar">
        <ul>
          <li class="anchor-item"
              v-for="i in 3"
              :key="i-1"
              :class="{'is-active':activeIndex===i-1}">
            {{ i }}
          </li>
        </ul>
      </div>
    </div>
    <div class="more-plugin">
      更多相关滚动插件 activeIndex:{{ instance.activeIndex }}
      <a
          target="_blank"
          :href="href">better-scroll
      </a>
    </div>
  </div>
</template>
<script>

import ScrollAnchor from '@/plugins/scroll-anchor.js'

export default {
  name: 'dashboard',
  data() {
    return {
      list: [],
      offsetTopArr: [],
      activeIndex: 0,
      href: 'https://github.com/ustbhuangyi/better-scroll/blob/master/packages/better-scroll/README_zh-CN.md',
      instance: {
        activeIndex: 0
      }
    }
  },
  methods: {
  },
  mounted() {
    this.$nextTick(() => {
      const instance = new ScrollAnchor({
        section: 'section',
        anchor: 'anchor-item',
        per: 5,
        paddingTop: 50,
        lastActive: true,
        speed: 3000,
        scrollContainer: 'scrollContainer'
        // scrollDom: document.getElementById('scrollContainer')
      })
      this.instance = instance;
      this.$once('hook:beforeDestroy', () => {
        instance.$emit('removeEvent')
      })
    })
  }
}
</script>
<style scoped lang="scss">
.right-bar {
  position: fixed;
  right: 30px;
  top: 0;
  height: 100vh;
  width: 100px;
  display: flex;
  align-items: center;

  .anchor-item {
    padding: 10px 0;
    cursor: pointer;

    &.is-active {
      color: red;
    }
  }
}

.section {
  height: 500px;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid red;

  &:nth-child(2) {
    height: 2000px;
  }
}

.scroll-top {
  position: fixed;
  width: 100%;
  top: 10px;
  font-size: 24px;
}

.left-content {
  height: 500px;
  overflow-y: auto;
}


</style>

<style lang="scss">
html,
body {
  overflow: hidden;
}
</style>