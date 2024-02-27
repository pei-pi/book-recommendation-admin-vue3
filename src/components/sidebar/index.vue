<template>
  <VaSidebar>
    <template v-for="item in items" :key="item.title">
      <VaSidebarItem :active="item.active" :to="{ name: item.name }">
        <VaSidebarItemContent>
          <i
            class="iconfont"
            :class="item.icon"
            :style="iconStyle(item.active)"
          ></i>
          <VaSidebarItemTitle class="text-sm">
            {{ item.title }}
          </VaSidebarItemTitle>
        </VaSidebarItemContent>
      </VaSidebarItem>
    </template>
  </VaSidebar>
</template>

<script setup>
import NavigationRoutes from "./NavigationRoutes";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
let items = ref(NavigationRoutes.routes);
let iconStyle = (active) => {
  return {
    fontSize: "1rem",
    color: active ? "white" : "rgb(68, 68, 68)",
    marginRight: "1rem",
  };
};
const route = useRoute();
watch(() => {
  items.value.forEach((item) => {
    item.active = item.name === route.name;
  });
});
</script>

<style scoped>
.iconfont:hover{
  color: black;
}
.va-sidebar-item:hover .iconfont{
  color: rgb(68, 68, 68) !important;
}
</style>
