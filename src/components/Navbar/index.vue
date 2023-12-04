<template>
    <VaNavbar
    color="#fff"
    class="mb-3"
  >
    <template #left>
      <VaNavbarItem class="logo">
        LOGO
      </VaNavbarItem>
    </template>
    <template #right>
      <VaNavbarItem class="hidden sm:block">
        Dashboard
      </VaNavbarItem>
      <VaNavbarItem class="hidden sm:block">
        Reports
      </VaNavbarItem>
      <VaNavbarItem class="hidden sm:block">
        Users
      </VaNavbarItem>
      <VaNavbarItem>
        <VaIcon
          name="mdi-magnify"
        />
      </VaNavbarItem>
      <VaNavbarItem>
        <VaIcon
          name="mdi-account-circle-outline"
        />
      </VaNavbarItem>
    </template>
  </VaNavbar>
</template>
<script setup>
import { useStore } from 'vuex'
import { ref } from "vue";
const store = useStore();
const isSidebarMinimized = ref(store.getters.sidebar)
import { computed } from "vue";
import { useColors } from "vuestic-ui";

const { currentPresetName } = useColors();

const darkNavbarColors = computed(() => {
  if (currentPresetName.value === "light") {
    return {
      color: "#111111",
      textColor: "#BAFFC5",
    };
  } else {
    return {
      color: "#FBCAF6",
      textColor: "#481269",
    };
  }
});
</script>

<style scoped>
.x-flip{
    transform: scaleX(-100%);
}
.navbar-item-slot {
  border: 1px dashed var(--va-secondary);
  padding: 6px 10px;
}
.va-navbar{
    box-shadow: var(--va-box-shadow);
    z-index: 2;
    width: 100vh;
}
.logo {
  font-weight: 600;
  font-size: 1.5rem;
}
</style>