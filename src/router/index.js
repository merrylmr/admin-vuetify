import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
    {
        path: '/',
        component: () => import ('@/views/Home.vue'),
        name: 'home',
        children: [
            {
                path: '/dashboard',
                component: () => import ('@/views/dashboard/Index.vue'),
                name: 'dashboard',
            },
            {
                path: '/canvas',
                component: () => import ('@/views/charts/Canvas.vue'),
                name: 'canvas',
            },
            {
                path: '/map',
                component: () => import ('@/views/charts/Map.vue'),
                name: 'map',
            },
            {
                path: '/tinymce',
                component: () => import ('@/views/comps/Tinymce.vue'),
                name: 'tinymce',
            },
            {
                path: '/watermark',
                component: () => import ('@/views/comps/Watermark.vue'),
                name: 'watermark',
            }
        ]
    },
]

const router = new VueRouter({
    routes: routes
})

export default router