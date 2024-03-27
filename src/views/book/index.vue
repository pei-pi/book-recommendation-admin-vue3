<template>
  <div class="mb-3">
    <VaButton
      color="info"
      size="medium"
      class="mr-3 w-20"
      @click="openModalToCreateItem()"
    >
      新增
    </VaButton>
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
    :model-value="!!createdItem"
    title="添加图书"
    okText="确定"
    cancelText="取消"
    @ok="addNewItem"
    @cancel="resetCreatedItem"
  >
    <VaInput
      v-for="(key, index) in filteredAddKeys"
      :key="index"
      v-model="addItem[key]"
      class="my-3 ml-5"
      :label="key"
    />
    <div class="max-w-xs flex">
      <VaSelect
        v-model="classifyValue"
        class="my-3 ml-5"
        :options="classify"
        label="分类"
      />
      <VaSelect
        v-model="detailClassifyValue"
        class="my-3 ml-5"
        :options="detailClassify"
        label="详细分类"
        :disabled="disabled"
      />
    </div>
    <VaTextarea
      class="my-3 ml-5"
      v-model="addItem['图书简介']"
      label="图书简介"
    />
    <div>
      <input
        type="image"
        class="my-3 ml-5"
        :src="addItem['src']"
        style="width: 250px"
        :hidden="hidden"
      />
      <input
        class="my-3 ml-5"
        style="background-color: "
        type="file"
        @change="changeAddImg"
      />
    </div>
  </VaModal>

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

  <VaModal
    :model-value="!!editedItem"
    title="编辑图书"
    okText="确定"
    cancelText="取消"
    @ok="editItem"
    @cancel="resetEditedItem"
  >
    <VaInput
      v-for="key in filteredEditKeys"
      :key="key"
      v-model="editedItem[key]"
      class="my-3 ml-5"
      :label="key"
      :disabled="key === 'id'"
    />
    <VaTextarea
      class="my-3 ml-5"
      v-model="editedItem['图书简介']"
      label="图书简介"
    />
    <input
      type="image"
      class="my-3 ml-5"
      :src="editedItem['src']"
      style="width: 250px"
    />
    <input
      class="my-3 ml-5"
      style="background-color: "
      type="file"
      @change="changeEditImg"
    />
  </VaModal>
</template>

<script setup>
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { useModal } from "vuestic-ui";
import { onMounted, computed, ref, watch } from "vue";
const baseURL = import.meta.env.VITE_APP_BASE_API;
const { confirm } = useModal();
const classifyValue = ref();
const detailClassifyValue = ref();
const classify = ref();
const detailClassify = ref();

const disabled = ref(true);
const hidden = ref(true);
const addItemSelectedFile = ref();

const itemDetail = ref(null);
const editedItem = ref(null);
const tempItem = ref(null);
const selectedItemsEmitted = ref(null);
var items = ref([]);
const selectedFile = ref();
const createdItem = ref(false);

const searchValue = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(7);

const columns = ref([
  { key: "标题", width: "20rem" },
  { key: "作者", width: "18rem" },
  { key: "标签" },
  { key: "分类" },
  { key: "actions" },
]);
const addItem = ref([
  {
    标题: "",
    作者: "",
    标签: "",
    分类: "",
    详细分类: "",
    馆藏数量: null,
    图书简介: "",
    src: "",
  },
]);

onMounted(() => {
  getBook();
  getClassify();
});

watch(classifyValue, (newValue, oldValue) => {
  if (newValue !== "") {
    disabled.value = false;
  }
  if (newValue !== oldValue) {
    detailClassifyValue.value = "";
    addItem.value.分类 = newValue;
    const cateId = classify.value.indexOf(newValue) + 1;
    return new Promise((resolve, reject) => {
      request({
        url: `/book/inquiryDetailClassify?cateId=${cateId}`,
        method: "get",
      })
        .then((res) => {
          console.log(res.data);
          detailClassify.value = res.data.detailClassify.map(
            (item) => item.subCateName
          );
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }
});
watch(detailClassifyValue, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    addItem.value.详细分类 = newValue;
  }
});
const filteredEditKeys = computed(() => {
  return Object.keys(editedItem.value).filter(
    (key) => key !== "图书简介" && key !== "src"
  );
});
const filteredAddKeys = computed(() => {
  return Object.keys(addItem.value[0]).filter(
    (key) =>
      key !== "图书简介" &&
      key !== "src" &&
      key !== "分类" &&
      key !== "详细分类"
  );
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
  selectedFile.value = null;
  return new Promise((resolve, reject) => {
    request({
      url: "/book/getAllBook",
      method: "get",
    })
      .then((res) => {
        items.value = [];
        res = res.data.books;
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
            src: `${baseURL}/${element.bookSrc}`,
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
// 获取分类列表
function getClassify() {
  return new Promise((resolve, reject) => {
    request({
      url: "/book/inquiryClassify",
      method: "get",
    })
      .then((res) => {
        console.log(res.data.classify);
        classify.value = res.data.classify.map((item) => item.cateName);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}
// 重置添加图书框
function resetAddItem() {
  classifyValue.value = "";
  detailClassifyValue = "";
  disabled.value = true;
  hidden.value = true;
  addItem.value = [
    {
      标题: "",
      作者: "",
      标签: "",
      分类: "",
      详细分类: "",
      馆藏数量: null,
      图书简介: "",
      src: "",
    },
  ];
}
// 增加图书=》图片
function changeAddImg(event) {
  if (event.target.files[0] !== "") hidden.value = false;
  addItemSelectedFile.value = event.target.files[0];
  addItem.value.src = URL.createObjectURL(event.target.files[0]);
}
// 打开新增图书模态框
function openModalToCreateItem() {
  createdItem.value = true;
}
// 新增图书=》图片
function addNewItem() {
  const formData = new FormData();
  if (addItemSelectedFile.value === undefined) {
    ElMessage({
      showClose: true,
      message: "图片不能为空",
      type: "error",
    });
  } else {
    formData.append("image", addItemSelectedFile.value);
    request({
      url: "/upload/image",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        addContent(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
// 新增图书=》内容
function addContent(src) {
  if (
    addItem.value["标题"] === undefined ||
    addItem.value["作者"] === undefined ||
    addItem.value["标签"] === undefined ||
    addItem.value["分类"] === undefined ||
    addItem.value["图书简介"] === undefined ||
    addItem.value["详细分类"] === undefined ||
    addItem.value["馆藏数量"] === null
  ) {
    ElMessage({
      showClose: true,
      message: "信息不能为空",
      type: "error",
    });
  } else if (!/(^[1-9]\d*$)/.test(addItem.value.馆藏数量)) {
    ElMessage({
      showClose: true,
      message: "请输入正确的数量",
      type: "error",
    });
  } else {
    return new Promise((resolve, reject) => {
      request({
        url: "book/addBook",
        method: "post",
        data: {
          bookTitle: addItem.value["标题"],
          bookAuthor: addItem.value["作者"],
          bookTags: addItem.value["标签"],
          bookContent: addItem.value["图书简介"],
          bookSrc: src,
          bookCategory: addItem.value["分类"],
          bookDetailCategory: addItem.value["详细分类"],
          store: addItem.value["馆藏数量"],
        },
      })
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "图书添加成功",
            type: "success",
          });
          resolve(res);
          getBook();
          resetCreatedItem();
        })
        .catch((error) => {
          ElMessage({
            showClose: true,
            message: "图书添加失败",
            type: "error",
          });
          console.error(error);
          reject(error);
        });
    });
  }
}
// 取消新增图书
function resetCreatedItem() {
  createdItem.value = false;
  addItemSelectedFile.value = "";
  classifyValue.value = "";
  disabled.value = true;
  hidden.value = true;
  addItem.value = [
    {
      标题: "",
      作者: "",
      标签: "",
      分类: "",
      详细分类: "",
      馆藏数量: null,
      图书简介: "",
      src: "",
    },
  ];
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
  if (selectedItemsArray.length === 0) {
    return;
  }
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
// 编辑图书模态框
function openModalToEditItemById(id) {
  tempItem.value = JSON.parse(
    JSON.stringify(this.items.filter((book) => book.id == id.rowData.id)[0])
  );
  editedItem.value = JSON.parse(
    JSON.stringify(this.items.filter((book) => book.id == id.rowData.id)[0])
  );
}
// 编辑图书-》图片
function editItem() {
  if (selectedFile.value) {
    const formData = new FormData();
    formData.append("image", selectedFile.value);
    request({
      url: "/upload/image",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        editContent(response.data.message, 1);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    var src = editedItem.value.src.split("/");
    editContent(src[src.length - 1], 0);
  }
}

// 编辑图书=》内容
function editContent(src, sign) {
  if (
    editedItem.value.标题 === tempItem.value.标题 &&
    editedItem.value.作者 === tempItem.value.作者 &&
    editedItem.value.标签 === tempItem.value.标签 &&
    editedItem.value.分类 === tempItem.value.分类 &&
    editedItem.value.图书简介 === tempItem.value.图书简介 &&
    editedItem.value.详细分类 === tempItem.value.详细分类 &&
    editedItem.value.馆藏数量 == tempItem.value.馆藏数量 &&
    sign === 0
  ) {
    editedItem.value = false;
  } else {
    return new Promise((resolve, reject) => {
      request({
        url: "book/updataBook",
        method: "post",
        data: {
          id: editedItem.value.id,
          bookTitle: editedItem.value.标题,
          bookAuthor: editedItem.value.作者,
          bookTags: editedItem.value.标签,
          bookContent: editedItem.value.图书简介,
          bookCategory: editedItem.value.分类,
          bookDetailCategory: editedItem.value.详细分类,
          store: editedItem.value.馆藏数量,
          bookSrc: src,
        },
      })
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "图书编辑成功",
            type: "success",
          });
          resolve(res);
          editedItem.value = false;
          getBook();
        })
        .catch((error) => {
          ElMessage({
            showClose: true,
            message: "图书编辑失败",
            type: "error",
          });
          console.error(error);
          reject(error);
        });
    });
  }
}

// 取消编辑图书
function resetEditedItem() {
  editedItem.value = false;
}
// 换图
function changeEditImg(event) {
  selectedFile.value = event.target.files[0];
  editedItem.value.src = URL.createObjectURL(selectedFile.value);
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
.va-data-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 显示省略号 */
}
.va-data-table__table-tr--expanded > td > div {
  width: 100%;
  background-color: pink;
}
.va-modal__dialog {
  overflow-x: hidden;
}
.va-modal__footer {
  margin-right: 30px;
}
</style>
