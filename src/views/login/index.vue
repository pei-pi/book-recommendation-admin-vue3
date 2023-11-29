<template>
  <div
    class="absolute w-1/3 l-1/2 t-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <va-form ref="loginForm" stateful class="mb-2 flex flex-col gap-4">
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
              :name="isPasswordVisible.value ? 'visibility_off' : 'visibility'"
              size="small"
              color="primary"
            />
          </template>
        </va-input>
      </va-value>
      <va-button :loading="loading" class="mt-2" @click.prevent="handleLogin"
        >Login</va-button
      >
    </va-form>
  </div>
</template>
<script setup>
import request from "@/utils/request";
import { useRoute , useRouter } from 'vue-router';
import { ref , watch } from "vue";
import { useStore } from 'vuex'

const loginForm = ref({
  username: " ",
  password: " ",
});

const loading = ref(false);
const hasError = ref(false);
const errorMessage = ref("This is an error message.");
const pwhasError = ref(false);
const pwErrorMessage = ref("This is an error message.");
const route = useRoute()
const redirect = ref(null)

watch(route,(to)=>{
    redirect.value = to.query && to.query.redirect
},{
    immediate:true
})

const store = useStore()
const router = useRouter()

async function handleLogin() {
  try {
    const res = await validForm();
    const myMap = new Map();
    let admins = res.data.administrator;
    admins.forEach(admin => {
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
      }else{
        pwhasError.value = false;
        loading.value = true;
        store.dispatch('user/login',loginForm.value).then(()=>{
            router.push({path:redirect.value || '/'})
            loading.value = false
        })
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
