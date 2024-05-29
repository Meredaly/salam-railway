<script setup lang="ts">
  import { computed } from 'vue'
  import type { PropType } from 'vue'

  import DropdownCheckbox from '@/UI/DropdownCheckbox.vue'
  import MyButton from '@/UI/MyButton.vue'

  import { StationsTable } from '../types'

  const emit = defineEmits(['check', 'reset'])
  const props = defineProps({
    documents: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    stations: {
      type: Array as PropType<StationsTable[]>,
      default: () => []
    },
    selectedStations: {
      type: Object as PropType<any>,
      default: () => {}
    }
  })

  const gruzCount = computed(() => {
    return props.stations.reduce((sum, station) => sum + station.gruz, 0)
  })

  const porCount = computed(() => {
    return props.stations.reduce((sum, station) => sum + station.por, 0)
  })

  const checkTableItem = (station: StationsTable, type: string) => {
    emit('check', { station, type })
  }

  const reset = () => {
    emit('reset')
  }
</script>

<template>
  <div class="documents-stations">
    <div class="documents-stations__wrapper">
      <div class="documents-stations__head">
        <div class="documents-stations__title">Документ</div>
        <div class="documents-stations__controllers">
          <my-button @click="reset" prev-icon="reset" styles="gray" />
        </div>
      </div>
      <div class="documents-stations__documents">
        <dropdown-checkbox :items="documents" placeholder="Все" />
      </div>
      <div class="documents-stations__stations">
        <div class="documents-stations__table">
          <table>
            <thead>
              <tr>
                <th>Станция</th>
                <th>ГРУЖ</th>
                <th>ПОР</th>
                <th>Всего</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="station in stations">
                <tr v-if="station.gruz || station.por">
                  <td
                    @click="checkTableItem(station, 'ALL')"
                    :class="{ _active: selectedStations[station.name]?.gruz && selectedStations[station.name]?.por }"
                  >
                    {{ station.name }}
                  </td>
                  <td @click="checkTableItem(station, 'GRUZ')" :class="{ _active: selectedStations[station.name]?.gruz }">{{ station.gruz }}</td>
                  <td @click="checkTableItem(station, 'POR')" :class="{ _active: selectedStations[station.name]?.por }">{{ station.por }}</td>
                  <td :class="{ _active: selectedStations[station.name]?.gruz && selectedStations[station.name]?.por }">
                    {{ station.gruz + station.por }}
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr>
                <td>Всего</td>
                <td>{{ gruzCount }}</td>
                <td>{{ porCount }}</td>
                <td>{{ gruzCount + porCount }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .documents-stations {
    width: 100%;
    height: 100%;
    // .documents-stations__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    // documents-stations__head
    &__head {
      display: flex;
      justify-content: space-between;
      padding-bottom: 6px;
    }

    // .documents-stations__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .documents-stations__controllers
    &__controllers {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    // .documents-stations__documents
    &__documents {
      padding-bottom: 14px;
    }
    // .documents-stations__stations
    &__stations {
      height: 0;
      flex: 1 1;
      border-radius: 4px;
      border: 1px solid var(--shade-400);
      overflow: hidden;
    }
    // .documents-stations__table
    &__table {
      height: 100%;
      overflow: auto;
      table {
        width: 100%;
        border-collapse: collapse;
        thead {
          tr {
            th {
              background: var(--background);
              padding: 10px;
              text-align: left;
              color: var(--text);
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              position: sticky;
              top: 0;
              z-index: 1;
            }
          }
        }
        tbody {
          tr {
            td {
              border: 1px solid var(--background);
              color: var(--text);
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
              padding: 6px 10px;
              cursor: pointer;
              user-select: none;
              &:hover {
                background-color: var(--shade-400);
              }
              &:first-child {
                border-left: none;
                &:hover ~ td {
                  background-color: var(--shade-400);
                }
              }
              &:last-child {
                border-right: none;
              }
              &._active {
                background-color: var(--primary) !important;
                color: var(--true-white) !important;
              }
            }
            &._active {
              td {
                background-color: var(--primary) !important;
                color: var(--true-white) !important;
              }
            }
          }
        }
        tfoot {
          tr {
            td {
              z-index: 1;
              position: sticky;
              bottom: 0;
              color: var(--text);
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              padding: 6px 10px;
              background-color: var(--shade-400);
            }
          }
        }
      }
    }
  }
</style>
