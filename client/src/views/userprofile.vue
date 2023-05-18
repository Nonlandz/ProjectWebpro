<template>
    <div class="user-profile">
      <h1>User Profile</h1>
      <div class="user-info">
        <p><strong>User ID:</strong> {{ userId }}</p>
        <p><strong>First Name:</strong> {{ userInfo.firstName }}</p>
        <p><strong>Last Name:</strong> {{ userInfo.lastName }}</p>
        <p><strong>Phone:</strong> {{ userInfo.phone }}</p>
        <p><strong>Address:</strong> {{ userInfo.address }}</p>
      </div>
    </div>
  </template>
  
  <style>
  .user-profile {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 5px;
  }
  
  .user-info {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
  }
  
  .user-info p {
    margin-bottom: 10px;
  }
  </style>
  
  <script>
  import axios from "axios";
  
  export default {
    name: 'UserProfile',
    props: {
      userId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        userInfo: {
          firstName: '',
          lastName: '',
          phone: '',
          address: ''
        }
      };
    },
    mounted() {
      // Fetch user information from an API endpoint using the userId prop
      this.fetchUserInfo();
      
    },
    methods: {
      async fetchUserInfo() {
        
        try {
            
          const response = await axios.get(`http://localhost:8080/api/user/profile/${this.userId}`);
          
          const { firstName, lastName, phone, address } = response.data.UserInfo;
          this.userInfo = {
            firstName,
            lastName,
            phone,
            address
          };
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  </script>
  