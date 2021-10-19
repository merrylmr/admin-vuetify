<template>
  <div class="mt-4">
    dashboard{{ msg }}
    <div id="render"></div>
  </div>
</template>

<script>
import Vue from "vue";
import vuetify from '@/plugins/vuetify.js'
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
Vue.use(iView);
export default {
  name: 'dashboard',
  data() {
    return {
      list: [],
      offsetTopArr: [],
      activeIndex: 0,
      msg: 'hello,world'
    }
  },
  methods: {},
  mounted() {
    const res = Vue.compile(`
  <div>
    dashboard{{ msg }},{{count}},{{count+1}}
    <p v-if="isShow">true</p>
    <p v-else>false</p>
    <p>{{time()}}</p>
    <p><Button type="primary" @click="count+=1">add count</Button></p>
  </div>
    `);
    console.log('res', res);
    new Vue({
      vuetify,
      data: {
        msg: 'hello',
        count: 1,
        isShow: true
      },
      render: res.render,
      methods: {
        time() {
          return new Date().toLocaleDateString()
        }
      },
      staticRenderFns: res.staticRenderFns
    }).$mount('#render')
  }
}
</script>