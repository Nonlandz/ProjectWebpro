<template>
    <div class="userinfo-form">
      <form @submit.prevent="submitForm">
        <input type="text" v-model="form.username" placeholder="Username" required>
        <input type="text" v-model="form.firstName" placeholder="First Name">
        <input type="text" v-model="form.lastName" placeholder="Last Name">
        <input type="text" v-model="form.phone" placeholder="Phone">
        <input type="text" v-model="form.address" placeholder="Address">
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      form: {
        userId: '', // We'll set this in the created() lifecycle hook
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
      }
    }
  },
  created() {
    // Retrieve the user from local storage
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.id) {
      // Set the userId in the form
      this.form.userId = user.id
    } else {
      // If there's no user id, redirect to login
      this.$router.push('/login')
    }
  },
  methods: {
    async submitForm() {
      try {
        await axios.put('/api/user/userinfo', this.form)
        this.$router.push('/') // Or wherever you want to redirect after successful submission
      } catch (error) {
        console.error('An error occurred:', error)
      }
    }
  }
}
</script>