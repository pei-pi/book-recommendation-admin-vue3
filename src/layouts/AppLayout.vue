<template>
   <div class="w-screen h-screen p-0 flex flex-col">
        <navbar />
        <div style="display:flex; height: 100%;">
            <sideBar class="pt-8" :minimized="mini"></sideBar>
            <div class="container flex flex-col w-full"> 
                <router-view></router-view>
            </div>
           
        </div>
    </div>
  </template>

<script setup>
import navbar from "../components/Navbar/index.vue";
import sideBar from "@/components/sidebar/index.vue";
import { ref, provide } from "vue";
const mini = ref(false);
provide("mini", mini);

</script>

<style scoped>
.container {
    background-color: white;
    margin:10px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 2px 2px 6px #a7a7a7;
}
</style>
