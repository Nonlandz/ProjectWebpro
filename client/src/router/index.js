import { createRouter, createWebHashHistory } from "vue-router";
import MyFav from '../views/MyFav.vue';
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
    path: "/profile",
    name: "profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/userinfo",
    name: "userinfo",
    component: () => import("../components/userinfo.vue"),
  },


  {
    path: "/myfav",
    name: "MyFav",
    component: () => import("../views/MyFav.vue"),
  },

  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: () => import("../views/userprofile.vue"),
    props: true
  },

  {
    path: '/admin',
    name: 'admin',
    component: () => import("../views/admin.vue"),
    props: true
  },



  {
    path: "/MyPost",
    name: "MyPost",
    component: () => import("../views/MyPost.vue"),
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
