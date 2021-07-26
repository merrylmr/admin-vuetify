<template>
  <div>
    <!--    <div class="scroll-top"> {{ scrollTop }}</div>-->
    <!--    <h1>dashboard</h1>-->
    <div>
      <div class="left-content" id="scrollContainer">
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
<!--            {{ i }}-->
            <a :href="`#section${i}`">
              {{i}}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {throttle} from '@/assets/js/utils.js'
import ScrollAnchor from '@/plugins/scroll-anchor.js'

export default {
  name: 'dashboard',
  data() {
    return {
      list: [],
      offsetTopArr: [],
      activeIndex: 0,
    }
  },
  methods: {
    getSectionList() {
      this.list = document.querySelectorAll('.section');
    },
    getOffsetTopArr() {
      this.list.forEach(item => {
        this.offsetTopArr.push(item.offsetTop)
      })
      console.log('this.offsetTopArr', this.offsetTopArr);
    },
    // 获取元素距离body的高度
    getElementOffsetTop() {
    },
    stepAction(index) {
      console.log('index', index)
      const offsetTop = this.offsetTopArr[index];
      console.log('offsetTop', offsetTop);
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      })
    },
    // TODO: 待优化，节流or防抖
    scrollEventInit() {
      const scrollHandle = throttle(() => {
        const scrollTop = document.documentElement.scrollTop;
        // 偏移量（当下一个模块距离顶部“xx px”时候，高亮）
        const diffY = 100;
        const index = this.offsetTopArr.findIndex((item => {
          return item > scrollTop + diffY
        }))
        // lastOne
        // scrollTop超出区域
        if (index === -1) {
          const len = this.offsetTopArr.length - 1;
          const h = this.list[len].clientHeight;
          if (scrollTop <= this.offsetTopArr[len] + h) {
            this.activeIndex = len;
          } else {
            this.activeIndex = -1;
          }

        } else if (index >= 1) {
          this.activeIndex = index - 1
        } else {
          // 第一个
          this.activeIndex = index;
        }


        console.log('this.offsetTopArr', this.offsetTopArr);
        console.log('scroll---1111', document.documentElement.scrollTop)
      }, 200)
      window.addEventListener('scroll', scrollHandle)
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.getSectionList()
      // this.getOffsetTopArr();
      new ScrollAnchor({
        section: 'section',
        anchor: 'anchor-item',
        // scrollDom: document.getElementById('scrollContainer')
      })
    })
    // this.scrollEventInit()
  }
}
</script>
<style scoped lang="scss">
.right-bar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 300px;
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
  //height: 500px;
  //overflow: scroll;

}
</style>