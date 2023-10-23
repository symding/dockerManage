import { createRouter, createWebHashHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import { useDockerClientStore } from '../store/dockerClient'
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HelloWorld
        },
        {
            path: '/login',
            name: 'login',
            component: HelloWorld
        },
        {
            path: '/e/:cli_id',
            name: "ActiveClient",

            component: () => import('../views/DashBoard.vue'),
            props: true,
            meta: {
                page_type: "ActiveClient"
            }
        },
        {
            path: '/e/:cli_id/container',
            name: 'Container',
            component: () => import('../views/DockerContainers.vue'),
            props: true,
            meta: {
                page_type: "Container"
            }
        },
        {
            path: '/e/:cli_id/service',
            name: 'Service',
            component: () => import('../views/DockerServices.vue'),
            props: true,
            meta: {
                page_type: "Service"
            }
        },
        {
            path: '/e/:cli_id/service/create',
            name: 'CreateService',
            component: () => import('../views/CreateService.vue'),
            props: true,
            meta: {
                page_type: "Service"
            }
        },
        {
            path: '/e/:cli_id/container/:container_id',
            component: () => import('../views/ContainerDetail.vue'),
            name: "Detail",
            props: true,
            meta: {
                page_type: "Container"
            },
        }

    ]
})


router.beforeEach((to, from) => {
    let store = useDockerClientStore()
    store.setActiveClient(to.params.cli_id)
})
export default router
