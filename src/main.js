import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify.js'
import router from './router/index.js'


import './assets/scss/index.scss'

Vue.config.productionTip = false
import * as echarts from 'echarts';

Vue.prototype.$echarts = echarts;
import lodash from 'lodash'

Vue.prototype._ = lodash

import xKeepAlive from './components/xKeepAlive/index'

Vue.use(xKeepAlive, {router})


import mockApi from '../public/mock/index.js'

mockApi();

import vCalendarMobile from 'v-calendar-mobile'

Vue.use(vCalendarMobile)

new Vue({
    router,
    vuetify,
    mounted() {
        document.dispatchEvent(new Event('render-event'))
    },
    render: h => h(App),
}).$mount('#app')
