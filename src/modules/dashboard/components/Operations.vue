<script setup lang="ts">
  import { ref, computed, watchEffect } from 'vue'
  import { Bar } from 'vue-chartjs'
  import ChartDataLabels from 'chartjs-plugin-datalabels'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

  const props = defineProps({
    operations: {
      type: Object,
      default: () => {}
    }
  })

  const labels = ref<string[]>([])
  const data = ref<number[]>([])

  const chartData = computed(() => {
    return {
      labels: labels.value,
      datasets: [
        {
          data: data.value,
          backgroundColor: '#14509d',
          borderRadius: 4,
          datalabels: {
            color: '#ffffff',
            font: {
              weight: 800,
              size: 12
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
          borderColor: 'transparent',
          tickColor: 'transparent',
          color: 'transparent'
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

  const minimizeName = (name: string): string => {
    return name.split(' ')[0].toUpperCase()
  }

  watchEffect(() => {
    let newLabels = []
    let newData = []
    for (const [key, value] of Object.entries(props.operations)) {
      newLabels.push(minimizeName(key.toString()))
      newData.push(Number(value))
    }
    labels.value = newLabels
    data.value = newData
  })
</script>

<template>
  <div class="operations">
    <div class="operations__wrapper">
      <div class="operations__title">Операция</div>
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
