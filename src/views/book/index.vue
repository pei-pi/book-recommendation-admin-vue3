<template>
  <div class="mb-3">
    <VaButton color="info" size="medium" class="mr-3 w-20"> 新增 </VaButton>
    <VaButton color="danger" size="medium" class="w-30" @click="bantchDelete()">
      批量删除
    </VaButton>
    <div class="float-right">
      <VaInput v-model="value" placeholder="Default" class="mr-2 h-8" />
      <VaButton icon="search" class="medium"> </VaButton>
    </div>
  </div>
  <VaDataTable
    :items="displayedItems"
    :columns="columns"
    selectable
    select-mode="multiple"
    @selection-change="selectedItemsEmitted = $event.currentSelectedItems"
  >
    <template #cell(actions)="{ row }">
      <VaButton
        class="pt-1"
        preset="plain"
        icon="edit"
        @click="openModalToEditItemById(row)"
      />
      <VaButton
        preset="plain"
        icon="delete"
        class="ml-3 pt-1"
        @click="deleteConfirm(row)"
      />
      <VaButton
        preset="plain"
        @click="showDetails(row)"
        class="mt-1 ml-3"
        size="small"
      >
        详情
      </VaButton>
    </template>
  </VaDataTable>
  <VaPagination
    v-model="currentPage"
    class="justify-center"
    :pages="totalPages"
    input
    buttons-preset="default"
  />

  <VaModal
    :model-value="!!itemDetail"
    title="详细信息"
    size="small"
    hide-default-actions
  >
    <div v-for="(key, value) in itemDetail" :key="key">
      <div class="mt-2 text-sm" v-if="value !== 'src'">
        <p class="inline font-semibold">{{ value }} :</p>
        {{ key }}
      </div>
    </div>
    <div
      style="
        width: 100px;
        position: absolute;
        top: 40px;
        right: 60px;
        border-radius: 5px;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
      "
    >
      <img :src="itemDetail.src" />
    </div>

    <div class="flex mt-4">
      <VaButton size="medium" preset="primary" @click="hide()"> 关闭 </VaButton>
    </div>
  </VaModal>
</template>

<script setup>
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { useModal } from "vuestic-ui";
import { onMounted, computed, ref } from "vue";

const { confirm } = useModal();

const itemDetail = ref(null);
const selectedItemsEmitted = ref(null);
var items = ref([]);

const columns = ref([
  { key: "标题" },
  { key: "作者" },
  { key: "标签" },
  { key: "分类" },
  { key: "actions" },
]);
const searchValue = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(7);
onMounted(() => {
  getBook();
});
const displayedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredItems.value.slice(startIndex, endIndex);
});
const filteredItems = computed(() => {
  if (!searchValue.value) return items.value;
  return items.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchValue.value.toLowerCase())
    )
  );
});
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});
// 获取图书列表
function getBook() {
  const baseURL = import.meta.env.VITE_APP_BASE_API;
  return new Promise((resolve, reject) => {
    request({
      url: "/book/getAllBook",
      method: "get",
    })
      .then((res) => {
        items.value = [];
        res = res.data.books;
        console.log(res);
        res.forEach((element, index) => {
          items.value[index] = {
            id: element.id,
            标题: element.bookTitle,
            作者: element.bookAuthor,
            标签: element.bookTags,
            分类: element.bookCategory,
            详细分类: element.bookDetailCategory,
            馆藏数量: element.store,
            图书简介: element.bookContent,
            src: `${baseURL}/${element.bookSrc}.jpg`,
          };
        });
      })
      .catch((error) => {
        ElMessage({
          showClose: true,
          message: "获取图书列表失败",
          type: "error",
        });
        reject(error);
      });
  });
}
// 显示详细信息
function showDetails(row) {
  itemDetail.value = row.rowData;
}
// 详细信息关闭功能
function hide() {
  itemDetail.value = null;
}
// 删除确认弹框
function deleteConfirm(row) {
  const delId = row.rowData.id;
  confirm({
    message: "是否删除此此图书？",
    okText: "确定",
    cancelText: "取消",
  }).then((ok) => ok && deleteItemById(delId));
}
// 删除
function deleteItemById(delId) {
  console.log(delId);
  return new Promise((resolve, reject) => {
    request({
      url: `/book/deleteBookById?bookId=${delId}`,
      method: "delete",
    })
      .then((res) => {
        ElMessage({
          showClose: true,
          message: "图书删除成功",
          type: "success",
        });

        getBook();
        resolve(res);
      })
      .catch((error) => {
        ElMessage({
          showClose: true,
          message: "图书删除失败",
          type: "error",
        });
        console.error(error);
        reject(error);
      });
  });
}
// 批量删除
function bantchDelete() {
  var selectedItemsArray = selectedItemsEmitted.value.map((item) => item.id);
  confirm({
    message: "是否删除选中图书？",
    okText: "确定",
    cancelText: "取消",
  }).then((ok) => ok && deleteItems(selectedItemsArray));
}
function deleteItems(selectedItemsArray) {
  return new Promise((resolve, reject) => {
    request({
      url: "book/bantchDeleteBook",
      method: "delete",
      data: selectedItemsArray,
    })
      .then((res) => {
        ElMessage({
          showClose: true,
          message: "批量删除成功",
          type: "success",
        });
        resolve(res);
        getBook();
      })
      .catch((error) => {
        console.error(error);
        ElMessage({
          showClose: true,
          message: "批量删除失败",
          type: "error",
        });
        reject(error);
      });
  });
}
</script>

<style>
.va-data-table__table-tr--expanded td {
  background: var(--va-background-border);
}

.va-data-table__table-expanded-content td {
  background-color: var(--va-background-element);
}
.va-data-table:not(.va-data-table--virtual-scroller) {
  overflow-x: hidden;
  overflow-y: auto;
}
.va-data-table {
  font-size: smaller;
}
.va-data-table__table-tr--expanded > td > div {
  width: 100%;
  background-color: pink;
}
</style>
