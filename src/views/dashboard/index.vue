<template>
  <div class="flex flex-row gap-5 max-h-52">
    <VaCard :bordered="false">
      <VaCardTitle>图书总数</VaCardTitle>
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
  <VaCard class="mt-8 p-3">
    <canvas id="chartCanvas"></canvas>
  </VaCard>
  
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import request from "@/utils/request";
import Chart from "chart.js/auto";
const bookSum = ref(0);
const userSum = ref(0);
const borrowSum = ref(0);
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "数量",
      backgroundColor: "#64B6F8",
      data: [],
    },
  ],
});
let chartInstance = null;

onMounted(() => {
  loadBooksSum();
  loadUsersSum();
  loadBorrowSum();
  draw();
});
async function draw() {
  await loadClassifyCount();
  initializeChart();
}
function initializeChart() {
  // 使用Chart.js创建一个新的图表实例
  const ctx = document.getElementById("chartCanvas").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales:{
        x:{
          grid:{
            display:false,
          }
        }
      },
      plugins: {
        legend:{
          display:false,
        },
        title: {
          display: true,
          text: '图书分类数量',
          font: {
            size: 15,
          },
        },
      },
      barThickness:40,
      
    },
  });
}

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

function loadClassifyCount() {
  return request({
    url: "/category/charts",
    methods: "get",
  })
    .then((res) => {
      chartData.value.labels = res.data.count.map((item) => item.cateName);
      chartData.value.datasets[0].data = res.data.count.map((item)=>item.num);
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<style scoped>
.va-card{
  background-color: rgb(243, 243, 243) !important;
}
.va-card-title{
  font-size: 14px;
}
</style>
