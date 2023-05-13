import { onMounted } from 'vue';
<template>
  <Layout>
    <Nav />
    <div class="w-full h-full flex flex-grow flex-col items-center">
      <div class="w-3/5 mt-5">
        <!-- tags -->
        <div class="w-full overflow-scroll flex gap-x-2 scrollbar-hide">
          <button
            @click="filterTag('all')"
            class="bg-gray-300 w-fit p-1 rounded-full px-5 cursor-pointer"
          >
            all
          </button>
          <button
            @click="filterTag(tag.id)"
            v-for="(tag, index) in tags"
            :key="index"
            class="bg-gray-300 w-fit p-1 rounded-full px-5 cursor-pointer"
          >
            {{ tag.name }}
          </button>
        </div>
        <!-- post -->
        <div
          class="w-full mt-5 bg-white rounded-md flex flex-col justify-between p-5"
        >
          <div class="w-full flex flex-grow" @click="openButton = true">
            <input
              type="text"
              placeholder="มาแลกสินค้ากัน"
              class="flex-grow focus:outline-none"
              v-model="createPost.title"
            />
            <label for="file" class="material-icons-outlined">image </label>
            <input
              class="hidden"
              type="file"
              id="file"
              @change="handleImagePreview"
            />
          </div>
          <div
            :class="`w-full mt-5 flex flex-col items-end border-t ${
              openButton ? 'flex' : 'hidden'
            }`"
          >
            <div
              class="w-full mt-5 flex justify-center relative"
              v-if="previewImage"
            >
              <img :src="previewImage" class="h-[300px] w-[300px]" alt="" />
              <button
                @click="previewImage = null"
                class="material-icons-outlined absolute -top-3 right-0 z-10 bg-white/90 rounded-full p-1 shadow-lg"
              >
                delete
              </button>
            </div>
            <textarea
              type="text"
              placeholder="รายละเอียดสินค้า"
              class="focus:outline-none w-full mt-5"
              v-model="createPost.detail"
            />
            <div class="w-full mb-5">
              <label for="">ประเภท</label>
              <select
                name=""
                id=""
                class="w-full py-0.5 mt-2 shadow-sm border rounded focus:outline-none focus:ring-0"
                v-model="createPost.tagId"
              >
                <option value="" disabled>เลือกประเภท</option>
                <option
                  :value="tag.id"
                  v-for="(tag, index) in tags"
                  :key="index"
                >
                  {{ tag.name }}
                </option>
              </select>
            </div>
            <button
              @click="addPost"
              class="bg-[#EB6648] text-white px-5 py-1 rounded-md mt-2"
            >
              post
            </button>
          </div>
        </div>
        <!-- posts -->
        <div class="flex flex-col gap-y-5 mt-5 border-t pt-5 mb-10">
          <div v-for="(post, index) in posts" :key="index">
            <div class="bg-white p-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    src="https://picsum.photos/200"
                    class="h-10 w-10 rounded-full"
                    alt=""
                  />
                  <span class="ml-2"
                    >{{ post?.User?.UserInfo?.firstName }}
                    {{ post?.User?.UserInfo?.lastName }}</span
                  >
                </div>

                <span class="rounded-full px-4 bg-gray-200">{{
                  post.Tag.name
                }}</span>
              </div>
              <p class="mt-5">{{ post.title }}</p>
              <div
                class="w-full mt-5 flex justify-center relative"
                v-if="post.image"
              >
                <img :src="post?.image" class="h-[300px] w-[300px]" alt="" />
              </div>
              <p class="mt-5">{{ post.detail }}</p>
              <div class="flex justify-between items-center mt-5 border-t pt-5">
                <div class="flex gap-x-5">
                  <button @click="like(post)" class="flex items-center gap-x-2">
                    <p
                      :class="{ like: post.like }"
                      class="material-icons-outlined"
                    >
                      favorite_border
                    </p>
                    <p>like ({{ post.UserFav.length }})</p>
                  </button>
                  <button
                    @click="this.$router.push(`/post/${post.id}`)"
                    class="flex items-center gap-x-2"
                  >
                    <p class="material-icons-outlined">chat_bubble_outline</p>
                    <p>comment ({{ post.Comment.length }})</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <button
        @click="fetchMoreItems"
        class="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        :disabled="loading || allItemsLoaded"
      >
        <span v-if="loading">
          <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 016.75 12H4v5.291zM19.25 12c0 2.485-.996 4.753-2.605 6.409l1.932 2.967A9.955 9.955 0 0022 12h-2.75zm-6.709 6.409A7.962 7.962 0 0112.25 17v-5.291h1.75l2.541 3.909z"
            ></path>
          </svg>
          Loading...
        </span>
        <span v-else> Load More </span>
      </button> -->
    </div>
  </Layout>
</template>

<script>
import Layout from "../components/Layout.vue";
import axios from "axios";
import Nav from "../components/Nav.vue";
import {
  ref as storageRef,
  getDownloadURL,
  listAll,
  uploadBytes,
} from "firebase/storage";
import { useFirebaseStorage } from "vuefire";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
const storage = useFirebaseStorage();

export default {
  components: {
    Layout,
    Nav,
  },
  data() {
    return {
      v$: useValidate(),
      tags: [],
      openButton: false,
      image: "",
      chooseImage: "",
      previewImage: null,
      createPost: {
        title: null,
        detail: null,
        tagId: null,
      },
      posts: [],
      userId: JSON.parse(localStorage.getItem("user"))?.id ?? null,
    };
  },
  validations() {
    return {
      createPost: {
        title: {
          required,
        },
        detail: {
          required,
        },
        tagId: {
          required,
        },
      },
      chooseImage: {
        required,
      },
    };
  },
  mounted() {
    this.checkAuth();
    this.getTag();
    this.getPost();
  },
  methods: {
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
    async uploadFile(file, postId) {
      try {
        const starsRef = storageRef(storage, `posts/${postId}/${file.name}`);
        await uploadBytes(starsRef, file);
      } catch (error) {
        console.log(error);
      }
    },

    handleImagePreview(event) {
      const file = event.target.files[0];
      this.chooseImage = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewImage = reader.result;
      };
    },

    async addPost() {
      try {
        const result = await this.v$.$validate();

        if (!result) {
          throw new Error("ใส่ข้อมูลไม่ครบ");
        }

        const res = await axios.post("http://localhost:8080/api/posts/", {
          ...this.createPost,
          userId: this.userId,
        });
        this.uploadFile(this.chooseImage, res.data.id);
        this.createPost = {
          title: "",
          detail: "",
          tagId: "",
        };
        this.previewImage = null;
        this.openButton = false;
        this.getPost();
        this.showAlert("success", "สร้างโพสสำเร็จ");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          this.showAlert("error", error?.response?.data?.message);
        } else {
          this.showAlert("error", error);
        }
      }
    },

    async getPost() {
      try {
        const res = await axios.get("http://localhost:8080/api/posts/");
        this.posts = res.data.filter((post) => post.status == "approve");
        this.posts.map(async (post) => {
          const starsRef = storageRef(storage, "posts/" + post.id);
          const search = await listAll(starsRef);
          if (search.items.length == 0) return;
          const download = (await getDownloadURL(search.items[0])).toString();
          post.image = download;
          this.checkLike(post);
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getTag() {
      try {
        const res = await axios.get("http://localhost:8080/api/tags/");
        this.tags = res.data;
      } catch (error) {
        console.log(error);
      }
    },

   async like(post) {
  try {
    const check = await axios.get(`http://localhost:8080/api/posts/fav?userId=${this.userId}&postId=${post.id}`);
    if (check.data.length != 0) {
      await axios.delete(
        `http://localhost:8080/api/posts/fav/${check.data[0].id}`
      );
      post.UserFav = post.UserFav.filter((fav) => fav.userId != this.userId);
    } else {
      await axios.post(`http://localhost:8080/api/posts/fav/`, {
        userId: this.userId,
        postId: post.id,
      });
      post.UserFav.push({ userId: this.userId, postId: post.id });
    }
    this.checkLike(post);
  } catch (error) {
    console.log(error);
  }
},



    async checkLike(post) {
      try {
        const check = await axios.get("http://localhost:8080/api/posts/fav", {
          params: {
            userId: this.userId,
            postId: post.id,
          },
        });
        post.like = check.data[0]?.postId == post.id;
      } catch (error) {
        console.log(error);
      }
    },

    async filterTag(tagId) {
      try {
        await this.getPost();
        if (tagId != "all") {
          const filter = this.posts.filter((post) => post.tagId == tagId);
          this.posts = filter;
        }
      } catch (error) {
        console.log(error);
      }
    },

    checkAuth() {
      !localStorage.getItem("token") && this.$router.push("/login");
    },

    async checkUserInfo() {
      try {
        const res = await axios.get("http://localhost:8080/api/users/", {
          params: {
            id: this.userId,
          },
        });
        if (!res.data.userInfo) {
          this.$router.push("/profile");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
