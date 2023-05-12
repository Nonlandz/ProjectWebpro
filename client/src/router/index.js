import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Main.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
  {
    path:"/post/:id",
    name:"post",
    component: () => import("../views/Post.vue"),
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: () => import("../views/Profile.vue"),
  },

  {
    path: "/userinfo",
    name: "userinfo",
    component: () => import("../components/userinfo.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
