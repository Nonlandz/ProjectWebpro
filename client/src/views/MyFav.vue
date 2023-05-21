<template>
  <Layout>
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-2xl font-bold mb-5">My Favorite Posts</h1>
      <div v-if="favoritePosts.length === 0 && !loading" class="text-gray-500">
        No favorite posts found.
      </div>
      <div v-else>
        <div v-for="(post, index) in favoritePosts" :key="index">
  <div class="bg-white p-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img
    :src="post?.Post?.User?.UserInfo?.profileImageUrl"
    class="h-10 w-10 rounded-full"
    alt=""
  />
        <span class="ml-2" @click="redirectToUserProfile(post?.Post?.User?.UserInfo?.userId)">
  {{ post?.Post?.User?.UserInfo?.firstName }}
  {{ post?.Post?.User?.UserInfo?.lastName }}
</span>
      </div>
      <span class="rounded-full px-4 bg-gray-200">
        {{ post?.Post?.Tag?.name }}
      </span>
    </div>
    <p class="mt-5">{{ post?.Post?.title }}</p>
    <div
      class="w-full mt-5 flex justify-center relative"
      v-if="post?.image"
    >
      <img :src="post?.image" class="h-[300px] w-[300px]" alt="" />
    </div>
    <p class="mt-5">{{ post?.Post?.detail }}</p>
    <p v-if="post?.Post?.exchangeEnded === true" class="mt-2 text-red-500">อุปกรณ์ถูกแลกเปลี่ยนเรียบร้อยแล้ว</p>
    <div class="flex justify-between items-center mt-5 border-t pt-5">
      <div class="flex gap-x-5">
        <button @click="like(post)" class="flex items-center gap-x-2">
          <p
            :class="{ like: post?.like }"
            class="material-icons-outlined"
          >
            favorite_border
          </p>
          <p>like ({{ post?.Post?.UserFav?.length }})</p>
        </button>
        <button
          class="flex items-center gap-x-2"
        >
          <p class="material-icons-outlined">chat_bubble_outline</p>
          <p>comment ({{ post?.Post?.Comment?.length }})</p>
        </button>
      </div>
    </div>
  </div>
</div>

    </div>
  </div>
</Layout>
</template>

<style scoped>
/* Add your custom styles here */

.container {
  max-width: 800px;
  margin: 0 auto;
}

.post-card {
  background-color: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.post-card .post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.post-card .post-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.post-card .post-info .post-user {
  display: flex;
  align-items: center;
}

.post-card .post-info .post-user span {
  margin-left: 0.5rem;
  font-weight: 600;
}

.post-card .post-tags {
  margin-bottom: 0.5rem;
}

.post-card .post-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 0.5rem;
}

.post-card .post-content {
  margin-top: 1rem;
}

.post-card .post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.post-card .post-actions button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-card .post-actions button p {
  font-size: 0.9rem;
}

.post-card .post-actions button .like {
  color: red;
}

.loading {
  text-align: center;
  margin-top: 2rem;
}

.loading .spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<script>
import axios from "axios";
import { ref as storageRef, getDownloadURL, listAll } from "firebase/storage";
import { useFirebaseStorage } from "vuefire";
import Layout from "../components/Layout.vue";
import Nav from "../components/Nav.vue";

export default {
  setup() {
    const storage = useFirebaseStorage();
    return { storage };
  },
  components: {
    Nav,
  },
  data() {
    return {
      favoritePosts: [],
      userId: JSON.parse(localStorage.getItem("user"))?.id ?? null,
      loading: false,
    };
  },
  mounted() {
    if (this.userId) {
      this.getFavoritePosts();
    }
    //this.getPost();
  },
  methods: {
    async getFavoritePosts() {
  try {
    this.loading = true;
    const res = await axios.get(`http://localhost:8080/api/user/fav/${this.userId}`);
    const favoritePosts = res.data.filter((post) => post.Post.status === 'approve');
    this.favoritePosts = favoritePosts;

    for (const post of this.favoritePosts) {
      const starsRef = storageRef(this.storage, `posts/${post.postId}`);
      const search = await listAll(starsRef);
      if (search.items.length > 0) {
        const download = await getDownloadURL(search.items[0]);
        post.image = download;
      }

      const profileImageUrl = await this.fetchProfileImage(post?.Post?.User?.UserInfo?.userId);
      post.Post.User.UserInfo.profileImageUrl = profileImageUrl;
    }

    this.loading = false;
  } catch (error) {
    console.log(error);
    this.loading = false;
  }
},


async fetchProfileImage(userId) {
  try {
    const starsRef = storageRef(this.storage, `users/${userId}`);
    const search = await listAll(starsRef);
    const downloadURL = (await getDownloadURL(search.items[0])).toString();
    return downloadURL;
  } catch (error) {
    console.log(error);
    return null;
  }
},






redirectToUserProfile(userId) {
  this.$router.push({ name: 'UserProfile', params: { userId: userId } });
},


    async like(choose) {
      const post = choose.Post;
      try {
        console.log(post);
        const userLike = post.UserFav.find((fav) => fav.userId === this.userId);
        console.log(userLike);
        if (userLike) {
          await axios.delete(
            `http://localhost:8080/api/posts/fav/${userLike.id}`
          );
          post.UserFav = post.UserFav.filter(
            (fav) => fav.userId !== this.userId
          );
        } else {
          const response = await axios.post(
            `http://localhost:8080/api/posts/fav/`,
            {
              userId: this.userId,
              postId: post.id,
            }
          );
          const newFav = response.data;
          post.UserFav.push(newFav);
        }
        this.getFavoritePosts()
        post.like = !post;
        post.like; // Toggle the like status for the post
      } catch (error) {
        console.log(error);
      }
    },
    navigateToPost(postId) {
      this.$router.push(`/post/${postId}`);
    },
  },
  components: { Layout },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
a