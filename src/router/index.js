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
                path: '/crop',
                component: () => import ('@/views/comps/Crop.vue'),
                name: 'crop',
            },
            {
                path: '/swiper',
                component: () => import ('@/views/comps/Swiper.vue'),
                name: 'swiper',
            },
            {
                path: '/dnd',
                component: () => import ('@/views/comps/Dnd.vue'),
                name: 'dnd',
            },
            {
                path: '/watermark',
                component: () => import ('@/views/comps/Watermark.vue'),
                name: 'watermark',
            },
            {
                path: '/AnchorScroll',
                component: () => import ('@/views/plugin/AnchorScroll.vue'),
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
            },
        ]
    },
    {
        path: '/sheet',
        component: () => import ('@/views/plugin/Sheet.vue'),
        name: 'sheet',
    },
    {
        path: '/calendar',
        component: () => import ('@/views/comps/calendar/Index.vue'),
        name: 'calendar',
    },
    {
        path: '/editor-3d',
        component: () => import ('@/views/threejs/Index.vue'),
        name: 'editor3d',
        children: [
            {
                path: 'view',
                name: 'view',
                component: () => import ('@/views/threejs/Index.vue'),
            },
            {
                path: 'basic',
                name: 'basic',
                component: () => import ('@/views/threejs/Index.vue'),
            },
            {
                path: 'hot',
                name: 'hot',
                component: () => import ('@/views/threejs/Index.vue'),
            }
        ]
    },
    {
        path: '/demo1',
        component: () => import ('@/views/threejs/Demo1.vue'),
        name: 'demo1',
    },
    {
        path: '/demo2',
        component: () => import ('@/views/threejs/Demo.vue'),
        name: 'demo2',
    },
    {
        path: '/first',
        component: () => import ('@/views/threejs/First.vue'),
        name: 'first',
    },
    {
        path: '/two',
        component: () => import ('@/views/threejs/Two.vue'),
        name: 'two',
    }
]

const router = new VueRouter({
    // mode: 'history',
    routes: routes
})

export default router