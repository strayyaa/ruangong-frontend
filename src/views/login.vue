<template>
    {{ message["name"] }}
    <div @click="testfun">asdsadsa</div>
</template>
  
<script setup>
import { ref } from 'vue'
import {getTest} from '../js/api.js'
const message = ref({"name":"123"});
const testfun = async () =>{
  message.value = await getTest();
}
</script>

<style scoped>

</style>
