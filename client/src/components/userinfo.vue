<template>
    <div class="userinfo-form min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <form @submit.prevent="submitForm" class="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">Username</label>
              <input id="username" name="username" type="text" v-model="form.username" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm" placeholder="Username">
            </div>
            <div>
              <label for="firstName" class="sr-only">First Name</label>
              <input id="firstName" name="firstName" type="text" v-model="form.firstName" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm" placeholder="First Name">
            </div>
            <div>
              <label for="lastName" class="sr-only">Last Name</label>
              <input id="lastName" name="lastName" type="text" v-model="form.lastName" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm" placeholder="Last Name">
            </div>
            <div>
              <label for="phone" class="sr-only">Phone</label>
              <input id="phone" name="phone" type="text" v-model="form.phone" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm" placeholder="Phone">
            </div>
            <div>
              <label for="address" class="sr-only">Address</label>
              <input id="address" name="address" type="text" v-model="form.address" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm" placeholder="Address">
            </div>
          </div>
          <div>
            <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200">
              Submit
            </button>
          </div>
        </form>
        <button @click="goBackToLogin" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200">
      Back to Login
    </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'



export default {
  data() {
    return {
      form: {
        userId: '',
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
      }
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.id) {
      this.form.userId = user.id
    } else {
      this.$router.push('/login')
    }
  },
  methods: {

    goBackToLogin() {
        localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.$router.push('/login');
  
},


async submitForm() {
  // Check if all fields are filled
  if (
    this.form.username &&
    this.form.firstName &&
    this.form.lastName &&
    this.form.phone &&
    this.form.address
  ) {
    // Check if the phone field contains only numbers
    const phonePattern = /^\d+$/;
    if (!phonePattern.test(this.form.phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Phone must contain only numbers.',
      });
      return;
    }

    try {
      const response = await axios.put('http://localhost:8080/api/user/userinfo', this.form);
      if (response.status === 200) {
        const user = JSON.parse(localStorage.getItem('user'));
        user.UserInfo = {
          username: this.form.username,
        };
        localStorage.setItem('user', JSON.stringify(user));
        this.$router.push('/');
      } else {
        throw new Error('Failed to update user info.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error.response.data.message}. Please choose another one.`,
        });
      } else {
        console.error('An error occurred:', error);
      }
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please fill in all fields.',
    });
  }
},


  }

  
}
</script>

  