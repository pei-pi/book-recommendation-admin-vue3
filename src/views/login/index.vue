<template>
  <div class="auth-layout grid grid-cols-12 content-center">
    <div class="flex col-span-12 p-4 justify-center">
      <router-link class="py-5 text-center justify-center flex" to="/">
        <h3 class="bold">Login</h3>
      </router-link>
    </div>

    <div class="flex justify-center col-span-12 p-4">
      <va-card class="auth-layout__card">
        <va-card-content>
          <div class="p-3">
            <va-form ref="loginForm" stateful class="mb- flex flex-col gap-4">
              <va-input
                class="h-16"
                v-model="loginForm.username"
                :error="hasError"
                :error-messages="errorMessage"
                label="用户名"
              />

              <va-value v-slot="isPasswordVisible" :default-value="false">
                <va-input
                  class="h-16"
                  v-model="loginForm.password"
                  :type="isPasswordVisible.value ? 'text' : 'password'"
                  :error="pwhasError"
                  :error-messages="pwErrorMessage"
                  label="密码"
                  @click-append-inner="
                    isPasswordVisible.value = !isPasswordVisible.value
                  "
                >
                  <template #appendInner>
                    <va-icon
                      :name="
                        isPasswordVisible.value
                          ? 'visibility_off'
                          : 'visibility'
                      "
                      size="small"
                      color="primary"
                    />
                  </template>
                </va-input>
              </va-value>
              <va-button
                :loading="loading"
                class="mt-4"
                @click.prevent="handleLogin"
                >Login</va-button
              >
            </va-form>
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>
<script setup>
import request from "@/utils/request";
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useStore } from "vuex";

const loginForm = ref({
  username: " ",
  password: " ",
});

const loading = ref(false);
const hasError = ref(false);
const errorMessage = ref("This is an error message.");
const pwhasError = ref(false);
const pwErrorMessage = ref("This is an error message.");
const route = useRoute();
const redirect = ref(null);

watch(
  route,
  (to) => {
    redirect.value = to.query && to.query.redirect;
  },
  {
    immediate: true,
  }
);

const store = useStore();
const router = useRouter();

async function handleLogin() {
  try {
    const res = await validForm();
    const myMap = new Map();
    let admins = res.data.administrator;
    admins.forEach((admin) => {
      myMap.set(admin.adminUsername, admin.adminPassword);
    });
    if (!myMap.has(loginForm.value.username)) {
      hasError.value = true;
      errorMessage.value = "用户不存在！";
    } else {
      hasError.value = false;
      if (myMap.get(loginForm.value.username) !== loginForm.value.password) {
        pwhasError.value = true;
        pwErrorMessage.value = "密码错误！";
      } else {
        pwhasError.value = false;
        loading.value = true;
        store.dispatch("user/login", loginForm.value).then(() => {
          router.push({ path: redirect.value || "/" });
          loading.value = false;
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

function validForm() {
  return new Promise((resolve, reject) => {
    request({
      url: "/user/administrator",
      method: "get",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
</script>
<style scoped>
.auth-layout {
    min-height: 100vh;
    background-image: linear-gradient(to right, var(--va-background-primary), var(--va-white));

   
  } 
  .va-card {
      width: 100%;
      max-width: 600px;
    }
</style>