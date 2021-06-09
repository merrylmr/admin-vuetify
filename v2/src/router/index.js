import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
    {
        path: '/',
        component: () => import ('@/views/Home.vue'),
        name: 'home',
    },
    {
        path: '/canvas',
        component: () => import ('@/views/charts/Canvas.vue'),
        name: 'canvas',
    }
]

const router = new VueRouter({
    routes: routes
})

export default router