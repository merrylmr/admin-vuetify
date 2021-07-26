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
                path: '/circle',
                component: () => import ('@/views/charts/Circle.vue'),
                name: 'circle',
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
            },
            {
                path: '/a',
                component: () => import ('@/views/keep-alive/A.vue'),
                name: 'a',
                meta: {keepAlive: true, deep: 1}
            },
            {
                path: '/b',
                component: () => import ('@/views/keep-alive/B.vue'),
                name: 'b',
                meta: {keepAlive: true, deep: 2}
            },
            {
                path: '/c',
                component: () => import ('@/views/keep-alive/C.vue'),
                name: 'c',
            },
            {
                path: '/noteList',
                component: () => import ('@/views/note/Index.vue'),
                name: 'noteList',
            }
        ]
    },
]

const router = new VueRouter({
    routes: routes
})

export default router