<template>
  <VaSidebar>
    <template v-for="item in items" :key="item.title">
      <VaSidebarItem :active="item.active">
        <VaSidebarItemContent>
          <i class="iconfont" :class="item.icon" :style="iconStyle(item.active)" ></i>
          <VaSidebarItemTitle>
            {{ item.title }}
          </VaSidebarItemTitle>
        </VaSidebarItemContent>
      </VaSidebarItem>
    </template>
  </VaSidebar>
</template>

<script setup>
import NavigationRoutes from "./NavigationRoutes";
import { ref } from "vue";
let items = ref(NavigationRoutes.routes);
let iconStyle = (active) => {
  return {
    fontSize: '1.3rem',
    color: active? 'white' : 'rgb(68, 68, 68)',
    marginRight: '1rem',
  }
}
</script>

<style scoped>
.va-sidebar-item:first-child {
  margin-top: 30px;
}
</style>
