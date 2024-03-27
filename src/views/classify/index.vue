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
  </div>
  <VaAccordion style="overflow-y: scroll">
    <VaCollapse
      v-for="(group, idx) in item"
      :key="idx"
      :header="group.title"
      body-color="background-element"
    >
      <template #body>
        <div v-for="(navItem, idx) in group.items" :key="idx" class="nav-item">
          {{ navItem.label }}
        </div>
      </template>
    </VaCollapse>
  </VaAccordion>
  <!-- 新增分类模态框 -->
  <VaModal
    :model-value="!!createdItem"
    title="添加分类"
    size="small"
    okText="确定"
    cancelText="取消"
    @ok="addNewItem"
    @cancel="resetCreatedItem"
  >
    <VaSelect
      v-model="classifyValue"
      class="my-3 ml-5"
      :options="classify"
      label="分类"
      :disabled="disabled"
    />
    <VaButton
      icon="add"
      class="ml-3 mt-6"
      icon-color="#fff"
      @click="addCategory"
    />
    <VaInput
      id="inp"
      v-model="addClassifyValue"
      class="my-3 ml-5"
      :style="style"
    />
    <VaInput v-model="subCateNameValue" class="my-3 ml-5" label="详细分类" />
  </VaModal>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
const category = ref();
const classify = ref();
const item = ref([]);
const createdItem = ref(false);
const disabled = ref(false);
const style = ref({ display: "none" });
const classifyValue = ref("");
const addClassifyValue = ref("");
const subCateNameValue = ref("");
const finalClassifyValue = ref("");

const cateID = ref(0);
const subCateID = ref(1);

onMounted(() => {
  getClassify();
});

function openModalToCreateItem() {
  createdItem.value = true;
}

function addCategory() {
  style.value = {
    display: "inline-block",
  };
  disabled.value = true;
  classifyValue.value = "";
}
function addNewItem() {
  if (classifyValue.value === "" && addClassifyValue.value === "") {
    ElMessage({
      showClose: true,
      message: "分类不能为空",
      type: "error",
    });
  }
  if (subCateNameValue.value === "") {
    ElMessage({
      showClose: true,
      message: "详细分类不能为空",
      type: "error",
    });
  }
  if (classifyValue.value !== "") {
    finalClassifyValue.value = classifyValue.value;
    for (let item of category.value) {
      if (item.cateName === classifyValue.value) {
        console.log(item);
        cateID.value = item.cateID;
        subCateID.value = item.subCateID + 1;
      }
    }
  } else if (addClassifyValue.value !== "") {
    finalClassifyValue.value = addClassifyValue.value;
    cateID.value = classify.value.length + 1;
  }
  return new Promise((resolve, reject) => {
    request({
      url: "/category/addCategory",
      method: "post",
      data: {
        cateID: cateID.value,
        cateName: finalClassifyValue.value,
        subCateID: subCateID.value,
        subCateName: subCateNameValue.value,
      },
    })
      .then((res) => {
        ElMessage({
          showClose: true,
          message: "分类添加成功",
          type: "success",
        });
        resolve(res);
        resetCreatedItem();
        getClassify();
      })
      .catch((error) => {
        ElMessage({
          showClose: true,
          message: "分类添加失败",
          type: "error",
        });
        reject(error);
      });
  });
}
// 重置添加模态框
function resetCreatedItem() {
  createdItem.value = false;
  style.value = {
    display: "none",
  };
  classifyValue.value = "";
  addClassifyValue.value = "";
  subCateNameValue.value = "";
  finalClassifyValue.value = "";
  disabled.value = false;
}
function getClassify() {
  return new Promise(() => {
    return request({
      url: "/category/inquiryClassify",
      methods: "get",
    })
      .then((res) => {
        classify.value = res.data.classify.map((item) => item.cateName);
        item.value = classify.value.map((item) => {
          return {
            title: item,
          };
        });
        request({
          url: "/category/inquiryCategory",
          method: "get",
        }).then((res) => {
          category.value = res.data.category;
          for (let i of item.value) {
            i.items = [];
            for (let j of category.value) {
              if (i.title === j.cateName) {
                i.items.push({ label: j.subCateName });
              }
            }
          }
          console.log(item.value);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
</script>
<style scoped>
.nav-item {
  display: flex;
  flex-direction: column;
  padding: var(--va-collapse-padding);
  transition: all 0.2s ease-in;
}
.nav-item:hover {
  background-color: var(--va-background-element);
}
.display {
  display: none;
}
</style>
