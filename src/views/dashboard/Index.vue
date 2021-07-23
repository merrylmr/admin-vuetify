<template>
  <div>
    <h1>dashboard</h1>
    <div>
      <div class="left-content">
        <div class="section"
             id="section1">1
        </div>
        <div class="section"
             i
             d="section2">2
        </div>
        <div class="section"
             id="section3">3
        </div>
        <div class="space" style="height:1000px"></div>
      </div>
      <div class="right-bar">
        <ul>
          <li class="item"
              v-for="i in 3"
              :key="i-1"
              :class="{'is-active':activeIndex===i-1}"
              @click="stepAction(i-1)">
            {{ i }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dashboard',
  data() {
    return {
      list: [],
      offsetTopArr: [],
      activeIndex: 0
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
      const scrollHandle = () => {
        const scrollTop = document.documentElement.scrollTop;

        // this.activeIndex = index
        // 高亮的条件：[0,500,1000]
        // <500  activeIndex:0
        // >=500 && <1000 activeIndex:1
        // >=1000 activeIndex:2

        // const diffY = 100
        // if (scrollTop + diffY < 500) {
        //   this.activeIndex = 0;
        // } else if (scrollTop + diffY >= 500 && scrollTop + diffY < 1000) {
        //   this.activeIndex = 1;
        // } else {
        //   this.activeIndex = 2;
        // }

        const index = this.offsetTopArr.findIndex((item => {
          return item > scrollTop
        }))

        console.log('index', index);
        // scrollTop超出区域
        if (index === -1) {
          this.activeIndex = this.offsetTopArr.length - 1;
        } else if (index >= 1) {
          // TODO: 这里可以适当的增加偏移量
          const diffY = 100
          const prevOffsetTop = this.offsetTopArr[index - 1];
          const curH = this.offsetTopArr[index] - this.offsetTopArr[index - 1];

          console.log('prevOffsetTop + diffY ', prevOffsetTop + diffY, 'scrollTop:', scrollTop, 'curH:', curH)
          this.activeIndex = index - 1
        } else {
          // 第一个
          this.activeIndex = index;
        }


        console.log('this.offsetTopArr', this.offsetTopArr);
        console.log('scroll---1111', document.documentElement.scrollTop)
      }
      window.addEventListener('scroll', scrollHandle)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getSectionList()
      this.getOffsetTopArr();
    })
    this.scrollEventInit()
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

  .item {
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
</style>