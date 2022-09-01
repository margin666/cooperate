import {createWebHashHistory, createRouter} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'


const routes:RouteRecordRaw[] = [
    {
        name: 'home',
        path: '/',
        component: () => import('../components/home.vue')
    },
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router