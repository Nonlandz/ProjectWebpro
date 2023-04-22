<template>
  <Layout>
    <div class="w-full h-full flex flex-grow items-center justify-center">
      <div class="w-96 border flex flex-col items-center gap-y-10 p-5 rounded-md shadow-md px-10 bg-white">
        <h1 class="text-3xl text-slate-600 font-bold my-10">Login</h1>
        <div class="w-full flex flex-col items-center gap-y-3">
          <div class="flex flex-col w-full">
            <label class="text-slate-600" for="username">Email</label>
            <input type="email" name="email" id="email" class="border rounded-md w-full py-1 px-1" v-model="data.email" />
          </div>
          <div class="flex flex-col w-full">
            <label class="text-slate-600" for="username">Password</label>
            <input type="password" name="password" id="password" class="border rounded-md w-full py-1 px-1" v-model="data.password" />
          </div>
        </div>
        <button @click="login" class="bg-[#EB6648] text-white w-full rounded-md py-1.5">submit</button>
        <p class="text-md text-gray-400 text-center mt-20">
          don't have an account? <a @click="this.$router.push('/register')" class="text-black/70 cursor-pointer block">Register now ✨</a>
        </p>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../components/Layout.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  components: {
    Layout,
  },
  data() {
    return {
      v$: useValidate(),
      data: {
        email: "",
        password: "",
      },
    };
  },
  validations() {
    return {
      data: {
        email: {
          required,
          email,
        },
        password: {
          required,
          minLength: minLength(6),
        },
      },
    };
  },
  methods: {
    async showAlert(type, text) {
      // Use sweetalert2
      const Toast = await this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: type,
        title: text,
      });
    },
    async login() {
      try {
        const result = await this.v$.$validate();

        if (!result) {
          // notify user form is invalid
          throw new Error("Invalid data");
        }

        const res = await axios.post("http://localhost:8080/api/user/login", this.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.accessToken);
        this.$router.push("/");
        this.showAlert("success", "Successfully registered");
      } catch (error) {
        if (error?.response?.data?.message) {
          this.showAlert("error", error?.response?.data?.message);
        } else {
          this.showAlert("error", error);
        }
      }
    },
  },
};
</script>
s
