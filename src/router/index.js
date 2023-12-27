import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue"
export const constantRoutes = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    component:AppLayout,
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/dashboard/index.vue"),
      },{
        path: "user",
        component:()=>import("@/views/user/index.vue"),
      },{
        path: "classify",
        component:()=>import("@/views/classify/index.vue"),
      },
      {
        path: "book",
        component:()=>import("@/views/book/index.vue"),
      },{
        path: "borrow",
        component:()=>import("@/views/borrow/index.vue"),
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });
  router.matcher = newRouter.matcher; // reset router
}

export default router;
