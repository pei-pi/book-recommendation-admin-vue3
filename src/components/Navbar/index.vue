<template>
  <VaNavbar color="#fff">
    <template #left>
      <i
        class="iconfont icon-zhankaicaidan"
        style="font-size: 27px; color: #154ec1"
      ></i>
    </template>
    <template #right>
      <VaDropdown class="pr-3">
        <template #anchor>
          <span class="pr-2 text-lg">{{ username }}</span>
          <i class="iconfont icon-xiangxiajiantou" style="color:#154ec1;font-size: 14px; "></i>
        </template>

        <VaDropdownContent>
          <va-list-item
            v-for="option in options"
            :key="option.name"
            class="p-2"
          >
            <router-link
              :to="{ name: option.redirectTo }"
              @click="logout(option.name)"
              class="profile-dropdown__item"
            >
              {{ option.name }}
            </router-link>
          </va-list-item>
        </VaDropdownContent>
      </VaDropdown>
    </template>
  </VaNavbar>
</template>
<script setup>
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router"
const store = useStore();
const router = useRouter();
const isSidebarMinimized = ref(store.getters.sidebar);
const username = store.getters.name
const options = ref([
  {
    name: "首页",
    redirectTo: "",
  },
  {
    name: "个人信息",
    redirectTo: "",
  },
  {
    name: "退出",
    redirectTo: "login",
  },
]);

function logout(e){
  if(e === "退出"){
    store.dispatch('user/logout').then(() => {
    router.push({ path: "login" });
  })
  }
}
</script>

<style scoped>
.va-navbar {
  box-shadow: var(--va-box-shadow);
}
.va-list-item:hover{
  color: #154ec1;
}
</style>
