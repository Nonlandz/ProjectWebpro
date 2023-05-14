<template>

      
    <div>
      <h1 class="text-2xl font-bold mb-5">My Favorite Posts</h1>
      <div v-if="favoritePosts.length === 0 && !loading">No favorite posts found.</div>
      <div v-else>
        <div v-for="(post, index) in favoritePosts" :key="index">
          <div class="bg-white p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img
                  src="https://picsum.photos/200"
                  class="h-10 w-10 rounded-full"
                  alt=""
                />
                <span class="ml-2">{{ post?.User?.UserInfo?.firstName }} {{ post?.User?.UserInfo?.lastName }}</span>
              </div>
              <span class="rounded-full px-4 bg-gray-200">{{ post.Tag.name }}</span>
            </div>
            <p class="mt-5">{{ post.title }}</p>
            <div class="w-full mt-5 flex justify-center relative" v-if="post.image">
              <img :src="post?.image" class="h-[300px] w-[300px]" alt="" />
            </div>
            <p class="mt-5">{{ post.detail }}</p>
            <div class="flex justify-between items-center mt-5 border-t pt-5">
              <div class="flex gap-x-5">
                <button @click="like(post)" class="flex items-center gap-x-2">
                  <p :class="{ like: post.like }" class="material-icons-outlined">
                    favorite_border
                  </p>
                  <p>like ({{ post.UserFav.length }})</p>
                </button>
                <button @click="navigateToPost(post.id)" class="flex items-center gap-x-2">
                  <p class="material-icons-outlined">chat_bubble_outline</p>
                  <p>comment ({{ post.Comment.length }})</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import axios from 'axios';
import { ref as storageRef, getDownloadURL, listAll } from "firebase/storage";
import { useFirebaseStorage } from "vuefire";
import Layout from "../components/Layout.vue";
import Nav from '../components/Nav.vue';



export default {
    component: {
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
        this.getPost();
    },
    methods: {
        async getFavoritePosts() {
            try {
                this.loading = true;
                const res = await axios.get(`http://localhost:8080/api/posts/fav/user/${this.userId}`);
                const favoritePosts = res.data.map((favPost) => favPost.Post);
                this.favoritePosts = favoritePosts;
                this.loading = false;
            }
            catch (error) {
                console.log(error);
                this.loading = false;
            }
        },
        async getPost() {
            try {
                const res = await axios.get("http://localhost:8080/api/posts/");
                const newPosts = res.data.filter((post) => post.status === "approve");
                for (const post of newPosts) {
                    const postId = post.id;
                    const userRes = await axios.get(`http://localhost:8080/api/users/${post.userId}`);
                    post.User = userRes.data;
                    const userInfoRes = await axios.get(`http://localhost:8080/api/user-info/${post.userId}`);
                    post.User.UserInfo = userInfoRes.data;
                    const starsRef = storageRef(storage, "posts/" + postId);
                    const search = await listAll(starsRef);
                    if (search.items.length > 0) {
                        const download = await getDownloadURL(search.items[0]);
                        post.image = download;
                        console.log("Image URL:", post.image);
                    }
                }
                this.posts = newPosts;
                this.updatePostLikes();
                this.loadLikedPostsFromLocalStorage();
            }
            catch (error) {
                console.log(error);
            }
        },
        async like(post) {
            try {
                const userLike = post.UserFav.find((fav) => fav.userId === this.userId);
                if (userLike) {
                    await axios.delete(`http://localhost:8080/api/posts/fav/${userLike.id}`);
                    post.UserFav = post.UserFav.filter((fav) => fav.userId !== this.userId);
                }
                        postId: post.id,
                    });
                    const newFav = response.data;
                    post.UserFav.push(newFav);
                }
                post.like = !post;
                post.like; // Toggle the like status for the post
            }
            catch (error) {
                console.log(error);
            }
        },
        navigateToPost(postId) {
            this.$router.push(`/post/${postId}`);
        },
    },
    components: { Layout }
};
</script>

<style scoped >
/* Add your custom styles here */
</style>
