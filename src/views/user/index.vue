<template>
  <div class="mb-5">
    <VaButton color="info" size="large" class="mr-3 w-20"> 新增 </VaButton>
    <VaButton color="danger" size="large" class="w-30"> 批量删除 </VaButton>
    <div class="float-right">
      <VaInput v-model="value" placeholder="Default" class="mr-2 h-10" />
      <VaButton icon="search" class="w-20 h-10"> </VaButton>
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
    striped
  >
    <template #cell(actions)="{ rowIndex }">
      <VaButton
        preset="plain"
        icon="edit"
        @click="openModalToEditItemById(rowIndex)"
      />
      <VaButton
        preset="plain"
        icon="delete"
        class="ml-3"
        @click="deleteItemById(rowIndex)"
      />
    </template>

    <template #bodyAppend>
      <tr>
        <td colspan="6">
          <div class="flex justify-center mt-4">
            <VaPagination style="flex:none;" v-model="currentPage" :pages="pages" />
          </div>
        </td>
      </tr>
    </template>
  </VaDataTable>

  <VaModal
    class="modal-crud"
    :model-value="!!editedItem"
    title="Edit item"
    size="small"
    @ok="editItem"
    @cancel="resetEditedItem"
  >
    <VaInput
      v-for="key in Object.keys(editedItem)"
      :key="key"
      v-model="editedItem[key]"
      class="my-6"
      :label="key"
    />
  </VaModal>
</template>

<script>
import { defineComponent } from "vue";

const defaultItem = {
  username: "",
  password: "",
  score: "",
};

export default defineComponent({
  data() {
    const items = [
      {
        username: "peipi",
        password: "123456",
        score: 90,
      },
      {
        username: "tidi",
        password: "111222",
        score: 100,
      },
      {
        username: "Patricia",
        password: "rgehixh223",
        score: 100,
      },
      {
        username: "Lebsack",
        password: "124rge4",
        score: 100,
      },
      {
        username: "Bauch",
        password: "12141341",
        score: 100,
      },
      {
        username: "Karianne",
        password: "22222222",
        score: 100,
      },
      {
        username: "Ervin",
        password: "111111",
        score: 100,
      },
      {
        username: "Samantha",
        password: "123456",
        score: 100,
      },
     
    ];

    const columns = [
      { key: "username", },
      { key: "password", },
      { key: "score",  },
      { key: "actions", },
    ];

    return {
      items,
      columns,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      perPage: 5,
      currentPage: 1,
      filter: "",
      filtered: items,
    };
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdItem).every(
        (key) => !!this.createdItem[key]
      );
    },
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
  },

  methods: {
    resetEditedItem() {
      this.editedItem = null;
      this.editedItemId = null;
    },
    resetCreatedItem() {
      this.createdItem = { ...defaultItem };
    },
    deleteItemById(id) {
      this.items = [...this.items.slice(0, id), ...this.items.slice(id + 1)];
    },
    addNewItem() {
      this.items = [...this.items, { ...this.createdItem }];
      this.resetCreatedItem();
    },
    editItem() {
      this.items = [
        ...this.items.slice(0, this.editedItemId),
        { ...this.editedItem },
        ...this.items.slice(this.editedItemId + 1),
      ];
      this.resetEditedItem();
    },
    openModalToEditItemById(id) {
      this.editedItemId = id;
      this.editedItem = { ...this.items[id] };
    },
  },
});
</script>
<style scoped>
.va-data-table{
    line-height: 46px;
    font-size: 1.2rem;
}
</style>
