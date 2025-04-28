<template>
    <img :src="imageUrl" :alt="imageDescription" />
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const imageUrl = ref('https://example.com/image.jpg');
  const imageDescription = ref('An example image');
  </script>
  
<style scoped>

</style>  