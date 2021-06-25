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
            },
            {
                path: '/a',
                component: () => import ('@/views/keep-alive/A.vue'),
                name: 'a',
            },
            {
                path: '/b',
                component: () => import ('@/views/keep-alive/B.vue'),
                name: 'b',
            },
            {
                path: '/c',
                component: () => import ('@/views/keep-alive/C.vue'),
                name: 'c',
            }
        ]
    },
]

const router = new VueRouter({
    routes: routes
})

// let historyStack = [];
//
router.beforeEach((to, from, next) => {
    const vm = router.history.current;
    console.log('beforeEach vm', vm);
    console.log('to', to, 'from', from, 'next')
    next()
})
router.afterEach(() => {
    // console.log("afterEach-", to, from);
// prev | isReplace | isPush | onBack
    const vm = router.history.current;
    console.log('afterEach', vm);
})

export const getCurrentVM = function (router) {
    return router.history.current.matched.length > 0
        ? router.history.current.matched[0].instances.default
        : undefined;
};

export default router