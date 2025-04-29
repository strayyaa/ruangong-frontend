<template>
    <NavBar />
</template>
  
<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'

const activeIndex = ref('1')
const activeIndex2 = ref('1')

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style scoped>

</style>