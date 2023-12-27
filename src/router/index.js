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
    redirect:"/dashboard",
    component:AppLayout,
    children: [
      {
        name:"Dashboard",
        path: "/dashboard",
        component: () => import("@/views/dashboard/index.vue"),
      },{
        name:"User",
        path: "user",
        component:()=>import("@/views/user/index.vue"),
      },{
        name:"Classify",
        path: "classify",
        component:()=>import("@/views/classify/index.vue"),
      },
      {
        name:"Book",
        path: "book",
        component:()=>import("@/views/book/index.vue"),
      },{
        name:"Borrow",
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
