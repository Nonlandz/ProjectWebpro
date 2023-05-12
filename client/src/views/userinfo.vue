<template>
    <div>
      <h2>Enter User Info</h2>
      <form @submit="submitForm">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="userInfo.username" required>
        
        <label for="firstName">First Name</label>
        <input type="text" id="firstName" v-model="userInfo.firstName" required>
        
        <label for="lastName">Last Name</label>
        <input type="text" id="lastName" v-model="userInfo.lastName" required>
        
        <label for="phone">Phone</label>
        <input type="text" id="phone" v-model="userInfo.phone" required>
        
        <label for="address">Address</label>
        <input type="text" id="address" v-model="userInfo.address" required>
        
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userInfo: {
          username: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: ''
        }
      };
    },
    methods: {
      submitForm(event) {
        event.preventDefault();
        
      }
    }
  };
  </script>
  