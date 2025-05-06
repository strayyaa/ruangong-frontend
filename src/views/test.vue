<!-- 这个文件仅用于测试 -->

<template>
    <NavBar></NavBar>
    {{ message["name"] }}
    <div @click="testfun">asdsadsa</div>
</template>
  
<script setup>
import { ref } from 'vue'
import {getTest} from '../js/api.js'
import NavBar from '../components/NavBar.vue';
const message = ref({"name":"123"});
const testfun = async () =>{
  message.value = await getTest();
}
</script>

<style scoped>

</style>
