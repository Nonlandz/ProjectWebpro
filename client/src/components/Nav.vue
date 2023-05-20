<template>
  <div class="w-full py-4 flex items-center justify-between bg-[#1E4F79] px-10 text-white">
    <a @click="this.$router.push('/')" class="text-xl cursor-pointer">IT x Change</a>
    <div class="w-2/4 relative flex items-center">
      <input type="text" class="rounded-md w-full text-black pl-8 focus:outline-none py-1" />
      <i class="material-icons-outlined absolute left-2 text-black">search</i>
    </div>
    <div class="flex items-center gap-x-10 relative">
      <button @click="this.$router.push('/myfav')" class="material-icons-outlined text-red-500">favorite</button>
      <span class="px-5"> {{ getUsername() }}</span>
      <button @click="dropdown = !dropdown" class="text-xl">menu</button>
    </div>
  
    <div class="absolute top-14 right-5 bg-white w-40 rounded-md" v-if="dropdown">
      <div class="flex flex-col items-start gap-y-2 text-black py-5">
        <button @click="this.$router.push('/profile')" class="px-5 hover:bg-slate-200 w-full text-left">profile</button>
        <button class="px-5 hover:bg-slate-200 w-full text-left">my post</button>
        <button @click="logout" class="px-5 hover:bg-slate-200 w-full text-left">logout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdown: false,
    };
  },
  methods: {
    getUsername() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.UserInfo && user.UserInfo.username ? user.UserInfo.username : '';
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>
