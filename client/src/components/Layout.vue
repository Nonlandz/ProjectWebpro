<template>
  <main class="w-screen min-h-screen flex flex-col items-center bg-zinc-100">
    <div class="w-full flex flex-grow flex-col items-center">
      <slot />
    </div>
    <Footer />
  </main>
</template>

<script>
import Footer from "./Footer.vue";
export default {
  components: {
    Footer,
  },
};
</script>
