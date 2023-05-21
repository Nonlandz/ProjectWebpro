<template>
  <Layout>
    <Nav />
    <div class="container mx-auto px-4 flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-5 mt-16">Welcome to User Page</h1>
      <div>
        <h2 class="text-2xl font-bold mb-2">Your Posts:</h2>
        <ul class="post-list">
          <li v-for="post in posts" :key="post.id" class="flex items-center mb-2">
            <span class="mr-2">{{ post.title }} - <span :class="getStatusClass(post.status)">{{ post.status }}</span></span>
            <button @click="showPostDetails(post.id)" class="px-2 py-1 bg-blue-500 text-white rounded-md ml-2">Details</button>
            <button v-if="post.status === 'noneApprove'" @click="deletePost(post.id)" class="px-2 py-1 bg-red-500 text-white rounded-md ml-2">Delete</button>
          </li>
        </ul>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../components/Layout.vue";
import axios from "axios";
import Swal from "sweetalert2";
import Nav from "../components/Nav.vue";

export default {
  components: {
    Layout,
    Nav,
  },
  data() {
    return {
      posts: [],
      userId: "", // Added userId data property
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user")); //  แปลง json เป็น  object 
    if (user && user.id) {
      this.userId = user.id; // Assign the user ID to the data property
      this.getPosts(this.userId);
    }
  },
  methods: {
    async getPosts(userId) { //ดึงโพสต์ตาม userid
      try {
        const response = await axios.get(`http://localhost:8080/api/posts?userId=${userId}`);
        this.posts = response.data.filter(post => post.userId === userId);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    async deletePost(postId) { //ลบโพสต์
      try {
        const confirmed = await Swal.fire({
          title: "Delete Post",
          text: "Are you sure you want to delete this post?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (confirmed.isConfirmed) {
          await axios.delete(`http://localhost:8080/api/posts/${postId}/${this.userId}`); // Use the userId data property
          this.posts = this.posts.filter(post => post.id !== postId);
          Swal.fire({
            title: "Post Deleted",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete post",
          icon: "error",
        });
      }
    },
    showPostDetails(postId) { //ดูdetail ของโพสต์
      const selectedPost = this.posts.find((post) => post.id === postId);
      if (selectedPost) {
        Swal.fire({
          title: selectedPost.title,
          html: `
            <strong>Status:</strong> ${selectedPost.status}<br>
            <strong>Detail:</strong> ${selectedPost.detail}
          `,
          icon: "info",
        });
      }
    },
    getStatusClass(status) {
      if (status === "approve") {
        return "text-green-500";
      } else if (status === "noneApprove") {
        return "text-red-500";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped>
/* General */
.container {
  font-family: Arial, sans-serif;
  max-width: 800px;
}

h1,
h2 {
  color: #1E4F79;
}

button {
  transition: background 0.3s ease-in-out;
}

button:hover {
  cursor: pointer;
}

/* Posts section */
ul.post-list {
  display: block;
}

li.flex.items-center.mb-2 {
  justify-content: space-between;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

button.bg-blue-500 {
  background: #1E4F79;
}

button.bg-blue-500:hover {
  background: #325d92;
}

button.bg-green-500 {
  background: #47D49D;
}

button.bg-green-500:hover {
  background: #5ED6A9;
}

button.bg-red-500 {
  background: #FF5A5A;
}

button.bg-red-500:hover {
  background: #FF7878;
}

.text-green-500 {
  color: #47D49D;
}

.text-red-500 {
  color: #FF5A5A;
}
</style>
