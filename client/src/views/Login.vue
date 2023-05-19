<template>
  <Layout>
    <div class="w-full h-full flex flex-grow items-center justify-center">
      <div class="w-96 border flex flex-col items-center gap-y-10 p-5 rounded-md shadow-md px-10 bg-white">
        <h1 class="text-3xl text-slate-600 font-bold my-10">ITxChange</h1>
        <div class="w-full flex flex-col items-center gap-y-3">
          <div class="flex flex-col w-full">
            <label class="text-slate-600" for="email">Email</label>
            <input type="email" name="email" id="email" class="border rounded-md w-full py-1 px-1" v-model="data.email" />
          </div>
          <div class="flex flex-col w-full">
            <label class="text-slate-600" for="password">Password</label>
            <input type="password" name="password" id="password" class="border rounded-md w-full py-1 px-1" v-model="data.password" />
          </div>
        </div>
        <button @click="login" class="bg-[#EB6648] text-white w-full rounded-md py-1.5">Submit</button>
        <p class="text-md text-gray-400 text-center mt-20">
          Don't have an account? <a @click="register" class="text-black/70 cursor-pointer block">Register now ✨</a>
        </p>
        <p class="text-md text-gray-400 text-center mt-5">
          <a @click="forgotPassword" class="text-black/70 cursor-pointer block">Forgot Password?✅</a>
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
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      if (localStorage.getItem("token")) {
        this.$router.push("/");
      }
    },
    async showAlert(type, text) {
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

    async forgotPassword() {
  try {
    const { value: result } = await this.$swal.fire({
      title: "Forgot Password",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Enter your email">
        <input id="swal-input2" type="password" class="swal2-input" placeholder="Enter your new password">
        <input id="swal-input3" type="password" class="swal2-input" placeholder="Confirm your new password">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const email = document.getElementById('swal-input1').value;
        const password = document.getElementById('swal-input2').value;
        const confirmPassword = document.getElementById('swal-input3').value;

        return axios.post("http://localhost:8080/api/user/forgotpassword", { 
          email, 
          password,
          confirmPassword
        }).then(response => {
          return email;
        }).catch(error => {
          this.$swal.showValidationMessage(error.response.data.message);   // updated
        });
      },
      allowOutsideClick: () => !this.$swal.isLoading(),
    });

    if (result) {
      this.showAlert("success", "Password has been successfully reset.");
    } else {
      this.showAlert("error", "Failed to reset password.");
    }
  } catch (error) {
    this.showAlert("error", error.message);
  }
},



async login() {
  try {
    const result = await this.v$.$validate();

    if (!result) {
      throw new Error("Invalid data");
    }

    const res = await axios.post("http://localhost:8080/api/user/login", this.data);

    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.accessToken);

    // Check if user information is complete
    if (!res.data.user.UserInfo.username) {
      // Redirect to userinfo page if user information is not complete
      this.$router.push("/userinfo");
      this.showAlert("info", "Please complete your user information.");
    } else {
      if (res.data.user.role === "admin") {
        // Redirect to admin page for admin users
        this.$router.push("/admin");
      } else {
        // Redirect to home page for non-admin users
        this.$router.push("/");
      }
      this.showAlert("success", "Successfully Login");
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      this.showAlert("error", error.response.data.message);
    } else {
      this.showAlert("error", error.message);
    }
  }
},


    register() {
      this.$router.push("/register");
    },
  },
};
</script>
