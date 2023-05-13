import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Main.vue"),
    meta: { requiresUsername: true },
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



router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (to.matched.some((record) => record.meta.requiresUsername)) {
    if (user && user.UserInfo && user.UserInfo.username) {
      // User has userinfo.username, allow navigation to the home page
      next();
    } else {
      // User does not have userinfo.username, redirect to the userinfo page
      next("/userinfo");
    }
  } else {
    // Allow navigation to other routes
    next();
  }
});



export default router;
