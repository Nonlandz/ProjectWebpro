<template>
  <div class="profile-upload">
    <h1>Upload Profile Image</h1>
    <input type="file" @change="handleImagePreview">
    <div v-if="previewImage">
      <img :src="previewImage" alt="Profile Image" class="preview-image">
    </div>
    <button @click="uploadProfileImage">Submit</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useFirebaseStorage } from 'vuefire';
import { ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage';

export default {
  setup() {
    const storage = useFirebaseStorage();
    const previewImage = ref(null);
    const chooseImage = ref(null);

    const handleImagePreview = (event) => {
      const file = event.target.files[0];
      chooseImage.value = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        previewImage.value = reader.result;
      };
    };

    const uploadProfileImage = async () => {
  try {
    const file = chooseImage.value;
    if (!file) {
      throw new Error('No image selected');
    }

    const user = JSON.parse(localStorage.getItem('user')); // Get the user object from localStorage
    if (!user || !user.id) {
      throw new Error('User ID not found in localStorage');
    }

    const userId = user.id;
    const filePath = `users/${userId}/${file.name}`;
    const starsRef = storageRef(storage, filePath);
    await uploadBytes(starsRef, file);

    const downloadURL = await getDownloadURL(starsRef);
    console.log('Profile image URL:', downloadURL);


    // Reset the input and preview
    chooseImage.value = null;
    previewImage.value = null;
  } catch (error) {
    console.log(error);

    // Handle the error here, e.g. display an error message to the user
    // or perform additional actions based on the specific error
  }
};





    return {
      storage,
      previewImage,
      handleImagePreview,
      uploadProfileImage,
    };
  },
};

</script>

<style>
.profile-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.preview-image {
  width: 200px;
  height: auto;
  margin-top: 20px;
}
</style>
