import Navigation from './Main.vue'

const install = (Vue) => {
    Vue.prototype.$eventBus = new Vue()
    // 动态删除
    Vue.prototype.$nav = {
        // 动态去掉某个缓存
        remove: (name) => {
            Vue.prototype.$eventBus.$emit('remove', name)
        },
    }
    Vue.component('xKeepAlive', Navigation)
}

export default install
