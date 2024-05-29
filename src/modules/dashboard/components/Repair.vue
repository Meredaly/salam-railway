<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Bar } from 'vue-chartjs'
  import ChartDataLabels from 'chartjs-plugin-datalabels'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

  const props = defineProps({
    repair: {
      type: Object,
      default: () => {}
    }
  })

  const chartData = computed(() => {
    return {
      labels: ['Время истекло', 'Истекает', 'Стабильно', 'Неизвестно'],
      datasets: [
        {
          data: [props.repair.danger, props.repair.warning, props.repair.success, props.repair.unknown],
          backgroundColor: ['#ff7171', '#fdfd52', '#72ff75', '#a0a4af'],
          borderRadius: 4,
          datalabels: {
            color: '#00030d',
            font: {
              weight: 800,
              size: 16
            }
          }
        }
      ]
    }
  })
  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true
      }
    },
    scales: {
      x: {
        grid: {
          color: 'transparent',
          borderColor: 'transparent',
          tickColor: 'transparent'
        }
      },
      y: {
        grid: {
          borderColor: 'transparent',
          tickColor: 'transparent'
        }
      }
    }
  })
</script>

<template>
  <div class="operations">
    <div class="operations__wrapper">
      <div class="operations__title">Дней до ремонта</div>
      <div class="operations__diagram">
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .operations {
    width: 100%;
    height: 100%;
    // .operations__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    // .operations__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .operations__diagram
    &__diagram {
      flex: 1 1;
      height: 0;
    }
  }
</style>
