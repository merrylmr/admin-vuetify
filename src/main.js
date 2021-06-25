import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify.js'
import router from './router/index.js'

import Navigation from 'vue-navigation'
Vue.use(Navigation, {router})
import './assets/scss/index.scss'

Vue.config.productionTip = false
import * as echarts from 'echarts';

Vue.prototype.$echarts = echarts;

export const isDef = function (v) {
    return v !== undefined && v !== null;
};


import mockApi from '../public/mock/index.js'

mockApi();

new Vue({
    router,
    vuetify,
    render: h => h(App),
}).$mount('#app')
