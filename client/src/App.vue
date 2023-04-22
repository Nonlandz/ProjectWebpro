<script setup>
import { onMounted } from "vue";
</script>

<template>
  <transition name="moveInUp">
    <router-view></router-view>
  </transition>
</template>
