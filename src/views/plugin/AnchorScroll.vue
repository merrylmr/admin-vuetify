
<template>
  <div>
    <div class="options">
      <div>
        <v-row>
          <v-col cols="4">
            <v-select
                v-model="options.scrollContainer"
                :items="items"
                item-text="label"
                item-value="value"
                label="滚动容器"
                required
            ></v-select>
          </v-col>
          <v-col cols="4"
                 class="d-flex align-center">
            <v-slider
                style="margin-top:25px"
                label="过渡时间"
                :max="10000"
                :min="0"
                :step="100"
                :dense="true"
                v-model="options.duration"
                thumb-label="always"
            ></v-slider>
          </v-col>
          <v-col cols="4">
            <v-checkbox
                v-model="options.lastActive"
                label="最后一个高亮"
            ></v-checkbox>
          </v-col>
        </v-row>
      </div>
    </div>
    <div>
      <div class="left-content scrollContainer"
           :style="scrollStyle"
           id="scrollContainer">
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

import ScrollAnchor from 'scroll-anchor'

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
      },
      options: {
        section: 'section',
        anchor: 'anchor-item',
        paddingTop: 50,
        lastActive: true,
        duration: 1000,
        scrollContainer: 'scrollContainer'
      },
      items: [
        {
          label: '默认',
          value: ''
        }, {
          label: 'scrollContainer',
          value: 'scrollContainer'
        }
      ]
    }
  },
  computed: {
    scrollStyle() {
      if (this.options.scrollContainer === 'scrollContainer') {
        return {
          'height': '500px',
          'overflow-y': 'auto'
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    init() {
      const instance = new ScrollAnchor(this.options)
      this.instance = instance;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  },
  beforeDestroy() {
    this.instance.$emit('removeEvent')
  },
  watch: {
    'options': {
      handler() {
        console.log('this.options', this.options)
        if (this.instance) {
          this.instance.$emit('removeEvent')
        }
        this.init();
      },
      deep: true
    }
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

.options {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 80%
}
</style>

<style lang="scss">
//html,
//body {
//  overflow: hidden;
//}
</style>