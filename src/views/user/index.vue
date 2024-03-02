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
      <VaInput v-model="value" placeholder="Default" class="mr-1 h-8" />
      <VaButton icon="search" size="medium"> </VaButton>
    </div>
  </div>

  <VaDataTable
    class="table-crud"
    :items="items"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    :filter="filter"
    @filtered="filtered = $event.items"
    selectable
    select-mode="multiple"
    @selection-change="selectedItemsEmitted = $event.currentSelectedItems"
    striped
  >
    <template #cell(actions)="{ rowIndex }">
      <VaButton
        preset="plain"
        icon="edit"
        class="mt-2"
        @click="openModalToEditItemById(rowIndex)"
      />
      <VaButton
        preset="plain"
        icon="delete"
        class="ml-3 mt-2"
        @click="deleteConfirm(rowIndex)"
      />
    </template>

    <template #bodyAppend>
      <tr>
        <td colspan="6">
          <div class="flex justify-center mt-4">
            <VaPagination
              style="flex: none"
              v-model="currentPage"
              :pages="pages"
            />
          </div>
        </td>
      </tr>
    </template>
  </VaDataTable>

  <!-- 新增用户模态框 -->
  <VaModal
    :model-value="!!createItem"
    title="添加用户"
    size="small"
    okText="确定"
    cancelText="取消"
    @ok="addNewItem"
    @cancel="resetCreatedItem"
  >
    <VaInput
      v-for="key in Object.keys(addItem[0])"
      :key="key"
      v-model="addItem[0][key]"
      class="my-6"
      :label="key"
    />
  </VaModal>

  <!-- 编辑用户模态框 -->
  <VaModal
    class="modal-crud"
    :model-value="!!editedItem"
    title="编辑用户"
    size="small"
    okText="确定"
    cancelText="取消"
    @ok="editItem"
    @cancel="resetEditedItem"
  >
    <VaInput
      v-for="key in Object.keys(editedItem)"
      :key="key"
      v-model="editedItem[key]"
      class="my-3 ml-2"
      :label="key"
      :disabled="key === 'userId'"
    />
  </VaModal>
</template>

<script setup>
import request from "@/utils/request";
import { onMounted, computed, ref } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useModal } from "vuestic-ui";

var items = ref([
  {
    userId: "",
    username: "",
    password: "",
    score: "",
  },
]);
const addItem = ref([
  {
    username: "",
    password: "",
    score: 100,
  },
]);
const columns = ref([
  { key: "username" },
  { key: "password" },
  { key: "score" },
  { key: "actions" },
]);

var items = ref([
  {
    userId: "",
    username: "",
    password: "",
    score: "",
  },
]);

const { confirm } = useModal();
const editedItem = ref(null);
const tempItem = ref(null);
const createItem = ref(false);
const perPage = ref(5);
const currentPage = ref(1);
const filter = ref("");
const filtered = ref(items.value);
const validation = ref(true);
const selectedItemsEmitted = ref(null);
onMounted(() => {
  getUser();
});
// 分页处理
const pages = computed(() => {
  return perPage.value && perPage.value !== 0
    ? Math.ceil(filtered.value.length / perPage.value)
    : filtered.value.length;
});
// 初始化用户列表
function getUser() {
  return new Promise((resolve, reject) => {
    request({
      url: "user/user",
      method: "get",
    })
      .then((res) => {
        res = res.data.user;
        console.log(res);
        items.value = [];
        res.forEach((element, index) => {
          items.value[index] = {
            userId: element.userId,
            username: element.username,
            password: element.userPassword,
            score: element.score,
          };
        });
        resolve(res);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}
// 删除确认弹框
function deleteConfirm(id) {
  const delId = this.items[id].userId;
  confirm({
    message: "是否删除此用户？",
    okText: "确定",
    cancelText: "取消",
  }).then((ok) => ok && deleteItemById(delId));
}
// 删除用户
function deleteItemById(id) {
  return new Promise((resolve, reject) => {
    request({
      url: `user/deleteUserById?userId=${id}`,
      method: "delete",
    })
      .then((res) => {
        ElMessage({
          showClose: true,
          message: "用户删除成功",
          type: "success",
        });
        resolve(res);
        getUser();
      })
      .catch((error) => {
        ElMessage({
          showClose: true,
          message: "用户更新失败",
          type: "error",
        });
        console.error(error);
        reject(error);
      });
  });
}
// 批量删除
function bantchDelete() {
  var selectedItemsArray = selectedItemsEmitted.value.map(
    (item) => item.userId
  );
  confirm({
    message: "是否删除选中用户？",
    okText: "确定",
    cancelText: "取消",
  }).then((ok) => ok && deleteItems(selectedItemsArray));
}
function deleteItems(selectedItemsArray) {
  if(selectedItemsArray.length === 0){
    return;
  }
  return new Promise((resolve, reject) => {
    request({
      url: "user/delete",
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
        getUser();
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
// 打开新增用户模态框
function openModalToCreateItem() {
  createItem.value = true;
}
// 添加用户
async function addNewItem() {
  await validate(addItem.value[0]);
  if (validation.value) {
    getUser().then((res) => {
      const usernames = res.map((user) => user.username);
      console.log(usernames);
      if (usernames.includes(addItem.value[0].username)) {
        ElMessage({
          showClose: true,
          message: "用户名已存在",
          type: "error",
        });
      } else {
        return new Promise((resolve, reject) => {
          request({
            url: "/user/insertUser",
            method: "post",
            data: {
              username: addItem.value[0].username,
              userPassword: addItem.value[0].password,
              score: addItem.value[0].score,
            },
          })
            .then((res) => {
              ElMessage({
                showClose: true,
                message: "用户添加成功",
                type: "success",
              });
              resolve(res);
              resetCreatedItem();
              getUser();
            })
            .catch((error) => {
              ElMessage({
                showClose: true,
                message: "用户更新失败",
                type: "error",
              });
              reject(error);
            });
        });
      }
    });
  }
}
// 取消添加用户
function resetCreatedItem() {
  createItem.value = false;
  addItem.value = [
    {
      username: "",
      password: "",
      score: 100,
    },
  ];
}
// 编辑用户模态框
function openModalToEditItemById(id) {
  editedItem.value = { ...this.items[id] };
  tempItem.value = { ...this.items[id] };
}
// 编辑用户
async function editItem() {
  await validate(editedItem.value);
  if (validation.value) {
    if (
      tempItem.value.username === editedItem.value.username &&
      tempItem.value.password === editedItem.value.password &&
      tempItem.value.score === editedItem.value.score
    ) {
      editedItem.value = false;
    } else {
      return new Promise((resolve, reject) => {
        request({
          url: "user/updateUser",
          method: "post",
          data: {
            userId: editedItem.value.userId,
            username: editedItem.value.username,
            userPassword: editedItem.value.password,
            score: editedItem.value.score,
          },
        })
          .then((res) => {
            ElMessage({
              showClose: true,
              message: "用户更新成功",
              type: "success",
            });
            resolve(res);
            editedItem.value = false;
            getUser();
          })
          .catch((error) => {
            ElMessage({
              showClose: true,
              message: "用户更新失败",
              type: "error",
            });
            console.error(error);
            reject(error);
          });
      });
    }
  }
}
// 取消编辑用户
function resetEditedItem() {
  editedItem.value = false;
}
function validate(item) {
  validation.value = true;
  console.log(item);
  return Promise.resolve()
    .then(() => {
      const uPattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,10}$/;
      if (!uPattern.test(item.username)) {
        ElNotification({
          title: "用户名不合法",
          message: "请输入4-10位中文、英文、数字或下划线。",
          type: "warning",
        });
        validation.value = false;
      }
    })
    .then(() => {
      const pPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
      if (!pPattern.test(item.password)) {
        ElNotification({
          title: "密码不合法",
          message: "请输入至少6位密码，同时并只含有字母和数字",
          type: "warning",
        });
        validation.value = false;
      }
    })
    .then(() => {
      const sPattern = /^([0-9][0-9]{0,1}|100)$/;
      if (!sPattern.test(item.score)) {
        ElNotification({
          title: "信誉分不合法",
          message: "请输入0-100的分数",
          type: "warning",
        });
        validation.value = false;
      }
    });
}
</script>
<style scoped>
.va-data-table {
  line-height: 35px;
}
</style>
