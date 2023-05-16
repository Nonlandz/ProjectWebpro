<template>
  <Layout>
    <Nav />
  <div>
    <h1 class="text-2xl font-bold mb-5">My Favorite Posts</h1>
    <div v-if="favoritePosts.length === 0 && !loading">
      No favorite posts found.
    </div>
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
              <span class="ml-2"
                >{{ post?.Post.User?.UserInfo?.firstName }}
                {{ post?.User?.UserInfo?.lastName }}</span
              >
            </div>
            <span class="rounded-full px-4 bg-gray-200">{{
              post.Post.Tag.name
            }}</span>
          </div>
          <p class="mt-5">{{ post.Post.title }}</p>
          <div
            class="w-full mt-5 flex justify-center relative"
            v-if="post.image"
          >
            <img :src="post?.image" class="h-[300px] w-[300px]" alt="" />
          </div>
          <p class="mt-5">{{ post.Post.detail }}</p>
          <div class="flex justify-between items-center mt-5 border-t pt-5">
            <div class="flex gap-x-5">
              <button @click="like(post)" class="flex items-center gap-x-2">
                <p :class="{ like: post.like }" class="material-icons-outlined">
                  favorite_border
                </p>
                <p>like ({{ post.Post.UserFav.length }})</p>
              </button>
              <button
                @click="navigateToPost(post.id)"
                class="flex items-center gap-x-2"
              >
                <p class="material-icons-outlined">chat_bubble_outline</p>
                <p>comment ({{ post.Post.Comment.length }})</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>
</template>

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
    //this.getPost();
  },
  methods: {
    async getFavoritePosts() {
      try {
        this.loading = true;
        const res = await axios.get(
          `http://localhost:8080/api/user/fav/${this.userId}`
        );
        this.favoritePosts = res.data;
        this.favoritePosts.map(async (post) => {
          const starsRef = storageRef(this.storage, "posts/" + post.postId);
          const search = await listAll(starsRef);
          if (search.items.length > 0) {
            const download = await getDownloadURL(search.items[0]);
            post.image = download;
          }
        });
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
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
