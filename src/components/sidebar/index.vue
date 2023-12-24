<template>
  <VaSidebar>
    <template v-for="item in items" :key="item.title">
      <VaSidebarItem :active="item.active">
        <VaSidebarItemContent>
          <VaIcon :name="item.icon" />
          <VaSidebarItemTitle>
            {{ item.title }}
          </VaSidebarItemTitle>
        </VaSidebarItemContent>
      </VaSidebarItem>
    </template>
  </VaSidebar>
</template>

<script setup>
import { ref } from "vue";
let items = ref([
  { title: "Dashboard", icon: "dashboard" },
  { title: "Sidebar demo", icon: "room", active: true },
  { title: "Loop", icon: "loop" },
]);
</script>

<style scoped>
.va-sidebar {
  position: fixed;
  top: 67px;
}
.va-sidebar-item:first-child {
  margin-top: 30px;
}
</style>
