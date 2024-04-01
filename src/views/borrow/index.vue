<template>
  <VaTabs style="margin-bottom: 20px" v-model="value">
    <template #tabs>
      <VaTab v-for="(tab, index) in tabs" :key="index">
        {{ tab }}
      </VaTab>
      <hr />
    </template>
  </VaTabs>
  <!-- 借阅审核页面内容 -->
  <div v-if="value === 0">
    <VaDataTable :items="displayItems" :columns="columns">
      <template #cell(actions)="{ row }">
        <VaButton size="small" color="info" @click="agree(row)">同意借阅</VaButton>
      </template>
    </VaDataTable>
    <VaPagination
      v-model="currentPage"
      class="justify-center"
      :pages="totalPages"
      input
      buttons-preset="default"
    />
  </div>

  <!-- 归还审核页面内容 -->
  <div v-if="value === 1">
    <VaDataTable :items="displayItems" :columns="columns">
      <template #cell(actions)="{ row }">
        <VaButton size="small" color="info" @click="back(row)">同意归还</VaButton>
      </template>
    </VaDataTable>
    <VaPagination
      v-model="currentPage"
      class="justify-center"
      :pages="totalPages"
      input
      buttons-preset="default"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed ,watch} from "vue";
import request from "@/utils/request";
import { useModal } from "vuestic-ui";

const { confirm } = useModal();
const currentPage = ref(1);
const itemsPerPage = ref(6);
const value = ref(0);
const tabs = ["借阅审核", "归还审核"];
const items = ref([
  {
    id: "",
    username: "",
    bookTitle: "",
    borrowTime: "",
    endTime: "",
    score: "",
  },
]);
const columns = ref([
  { key: "id" },
  { key: "username" },
  { key: "bookTitle" },
  { key: "borrowTime" },
  { key: "endTime" },
  { key: "score" },
  { key: "actions" },
]);
onMounted(() => {
  getBorrowMessage();
});
watch(value,(newVal,oldVal)=>{
  console.log(newVal);
  if(newVal===0){
    getBorrowMessage()
  }else{
    getBackMessage();
  }
})
const displayItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return items.value.slice(startIndex, endIndex);
});
const totalPages = computed(() => {
  return Math.ceil(items.value.length / itemsPerPage.value);
});
function getBorrowMessage() {
  return new Promise((resolve, reject) => [
    request({
      url: "/borrow/findBorrowMessage",
      method: "get",
    })
      .then((res) => {
        console.log(res);
        items.value = res.data.msg;
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      }),
  ]);
}
function agree(row) {
  console.log(row.rowData);
  confirm("是否确定同意？").then(
    (ok) =>
      ok &&
      request({
        url: `/borrow/checkBorrow?id=${row.rowData.id}`,
        method: "get",
      })
        .then((res) => {
          console.log(res);
          getBorrowMessage();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        })
  );
}
function getBackMessage() {
  return new Promise((resolve, reject) => [
    request({
      url: "/borrow/findBackMessage",
      method: "get",
    })
      .then((res) => {
        console.log(res);
        items.value = res.data.msg;
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      }),
  ]);
}
function back(row) {
  console.log(row.rowData);
  confirm("是否确定同意？").then(
    (ok) =>
      ok &&
      request({
        url: `/borrow/checkBack?id=${row.rowData.id}`,
        method: "get",
      })
        .then((res) => {
          console.log(res);
          getBackMessage();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        })
  );
}
</script>

<style scoped>
.va-tabs {
  flex: none;
}
.va-data-table {
  font-size: smaller;
}
.va-data-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 显示省略号 */
}

.va-pagination {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
