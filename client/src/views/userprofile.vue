<template>
  <div class="w-full h-screen flex items-center justify-center bg-[#e5e7e9]">
    <div class="user-profile w-4/12 h-100 flex flex-col items-center justify-center content-center rounded-md shadow-md bg-white">
      <h1 class="text-3xl text-[#1E4F79] mt-4 font-bold">User Profile</h1>
      <div class="user-info text-xl">
        <p><label class="font-medium text-slate-600">User ID :</label> {{ userId }}</p>
        <div class="grid grid-cols-2 gap-5">
        <p><label class="font-medium text-slate-600">First Name :</label> {{ userInfo.firstName }}</p>
        <p><label class="font-medium text-slate-600">Last Name :</label> {{ userInfo.lastName }}</p>
        </div>
        <p><label class="font-medium text-slate-600">Phone :</label> {{ userInfo.phone }}</p>
        <p><label class="font-medium text-slate-600">Address :</label> {{ userInfo.address }}</p>
      </div>
      <button class="p-5 bg-[#EB6648] text-white px-5 py-1 rounded-md mb-4 hover:bg-[#df593a] drop-shadow-lg">Back To Post</button>
    </div>
  </div>
  </template>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit&display=swap');
  .user-profile {
    /* background-color: #f5f5f5; */
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
  