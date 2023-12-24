import { createRouter, createWebHistory } from "vue-router";
export const constantRoutes = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    name: "navbar",
    path: "/navbar",
    component: () => import("@/layouts/AppLayout.vue"),
  },
  {
    path: "/",
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "首页", icon: "dashboard" },
      },{
        path: "user",
        name: "User",
        component:()=>import("@/views/user/index.vue"),
        meta: {title:"用户管理",icon:""},
      },{
        path: "classify",
        name: "Classify",
        component:()=>import("@/views/classify/index.vue"),
        meta: {title:"图书分类管理",icon:""},
      },
      {
        path: "book",
        name: "Book",
        component:()=>import("@/views/book/index.vue"),
        meta: {title:"图书管理",icon:""},
      },{
        path: "borrow",
        name: "Borrow",
        component:()=>import("@/views/borrow/index.vue"),
        meta: {title:"借阅管理",icon:""},
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
