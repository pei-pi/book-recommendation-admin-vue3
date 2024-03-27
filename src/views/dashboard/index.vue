<template>
  <div class="flex flex-row gap-5 max-h-52">
    <VaCard :bordered="false">
      <VaCardTitle>图书数目</VaCardTitle>

      <VaCardContent>
        {{ bookSum }}
      </VaCardContent>
    </VaCard>
    <VaCard :bordered="false">
      <VaCardTitle>用户总数</VaCardTitle>
      <VaCardContent>
        {{ userSum }}
      </VaCardContent>
    </VaCard>

    <VaCard :bordered="false">
      <VaCardTitle class="">借阅中</VaCardTitle>
      <VaCardContent>
        {{ borrowSum }}
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import request from "@/utils/request";
const bookSum = ref(0);
const userSum = ref(0);
const borrowSum = ref(0);

onMounted(() => {
  loadBooksSum();
  loadUsersSum();
  loadBorrowSum();
  loadClassifyCount();
});

function loadBooksSum() {
  return new Promise((resolve, reject) => {
    request({
      url: "/book/getBooksCount",
      methods: "get",
    })
      .then((res) => {
        bookSum.value = res.data.sum;
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
function loadUsersSum() {
  return new Promise((resolve, reject) => {
    request({
      url: "/user/userCount",
      methods: "get",
    })
      .then((res) => {
        userSum.value = res.data.count;
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
function loadBorrowSum() {
  return new Promise((resolve, reject) => {
    request({
      url: "/book/getBorrowBooksCount",
      methods: "get",
    })
      .then((res) => {
        borrowSum.value = res.data.count;
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
function loadClassifyCount(){
  return new Promise((resolve, reject) => {
    request({
      url: "/book/charts",
      methods: "get",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
</script>

<style scoped></style>
