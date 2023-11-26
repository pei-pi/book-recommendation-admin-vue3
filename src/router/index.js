import { createRouter,createWebHistory } from 'vue-router'
export const constantRoutes = [
    {
        path:'/login',
        component:()=>import('@/views/login/index.vue'),
    }
]
  
  const router = createRouter({
    history:createWebHistory(),
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
  
  export function resetRouter() {
    const newRouter = createRouter({
        history:createWebHistory(),
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
    })
    router.matcher = newRouter.matcher // reset router
  }
  
  export default router