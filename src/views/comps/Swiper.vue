<template>
  <div>
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide
          v-for="(item,index) in list"
          :key="index">
        <div>Slide {{ item }}</div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>

    <div class="img">
      <img src="https://f.cdn-static.cn/33245_15964416642372.jpg?imageView2/2/w/878/q/75" alt="">
      <div class="mask"></div>
    </div>
  </div>

</template>

<script>
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: 'my-swiper',
  data() {
    return {
      list: [1, 2, 3, 4, 5],
      swiperOptions: {
        loop: true,
        slidesPerView: 3,
        loopedSlides: 5,
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination'
        },
        on: {
          click: (e) => {
            const index = this.swiper.clickedSlide.dataset.swiperSlideIndex;

            const data = this.list[index];
            console.log('index', index, data,
                e.target.closest('.swiper-slide').dataset.swiperSlideIndex,
            )
          }
        }
      }
    }
  },
  components: {Swiper, SwiperSlide},
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  mounted() {
    console.log('Current Swiper instance object', this.swiper)
    // this.swiper.slideTo(3, 1000, false)
  }

}
</script>

<style scoped lang="scss">
.swiper-container {
  height: 400px;
}

.swiper-slide {
  border: 1px solid red;
  //width: 300px!important;

  img {
    //width: 100%;
  }
}

.img {
  margin-left: 300px;
  position: relative;
  width: 300px;
  height: 400px;
  transform: skewX(-10deg);


  img {
    width: 100%;
  }

  .mask {
    position: absolute;
    left: 8%;
    top: 30px;
    width: 95%;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    //transform: skewX(-10deg)
  }
}
</style>