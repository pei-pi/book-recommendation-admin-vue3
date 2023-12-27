<template>
    <div class="w-screen h-screen p-0 flex flex-col">
        <navbar />
        <div  style="display: flex; height: 100%;">
            <sideBar :minimized="mini"></sideBar>
            <div class="flex flex-row"></div>
            <router-view class="w-screen"></router-view>
        </div>
    </div>
</template>

<script setup>
import navbar from '../components/Navbar/index.vue'
import sideBar from '@/components/sidebar/index.vue'
import { ref , provide} from 'vue'
const mini = ref(false);
provide('mini',mini);
</script>

<style scoped>

</style>