import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify.js'
import router from './router/index.js'

import './assets/scss/index.scss'

Vue.config.productionTip = false
import * as echarts from 'echarts';

Vue.prototype.$echarts = echarts;

import mockApi from '../public/mock/index.js'

mockApi();

new Vue({
    router,
    vuetify,
    render: h => h(App),
}).$mount('#app')
