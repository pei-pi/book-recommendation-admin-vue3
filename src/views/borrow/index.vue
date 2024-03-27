<template>
    <VaTabs v-model="value">
    <template #tabs>
      <VaTab
        v-for="(tab,index) in tabs"
        :key="index"
      >
        {{ tab }}
      </VaTab>
    </template>
  </VaTabs>
  <!-- 借阅审核页面内容 -->
  <div v-if="value === 0">

</div>
  <!-- 归还审核页面内容 -->
  <div v-if="value === 1">
    
  </div>
</template>

<script setup>
import {ref} from 'vue';
const value = ref(0);
const tabs = ['借阅审核','归还审核']

</script>

<style scoped>

</style>