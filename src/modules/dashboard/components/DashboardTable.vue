<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import type { PropType } from 'vue'
  import Icon from '@/UI/Icon'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'

  import { TableItem } from '../types'
  import { TableHeadItem } from '@/types'

  import { tableToExcel } from '../helpers/tableToExcel'

  import { useFilters } from '@/composables/filters'
  import { useTableFilter } from '@/composables/table'

  const emit = defineEmits(['bigTable', 'selectRow'])
  const props = defineProps({
    table: {
      type: Array as PropType<TableItem[]>,
      default: () => []
    },
    height: { type: Number, default: 0 },
    fullScreen: { type: Boolean, default: false },
    types: { type: Array as PropType<any>, default: () => [] }
  })

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter()

  sortKey.value = 'numberVan'

  const tableHead = ref<TableHeadItem[]>([
    { id: '1', sort: true, visibility: true, key: 'numberVan', title: 'Номер вагона' },
    // { id: '2', sort: true, visibility: true, key: 'act', title: 'Налич.....' },
    { id: '3', sort: true, visibility: true, key: 'lastStation', title: 'Предыдущая станция' },
    { id: '4', sort: true, visibility: true, key: 'currentStation', title: 'Станция' },
    { id: '5', sort: true, visibility: true, key: 'statusVan', title: 'Операция' },
    { id: '6', sort: true, visibility: true, key: 'date', title: 'Время' },
    { id: '7', sort: true, visibility: true, key: 'typeVan', title: 'Состояние' },
    { id: '8', sort: true, visibility: true, key: 'setStation', title: 'Станция назначения' },
    { id: '9', sort: true, visibility: true, key: 'hourForPassedWay', title: 'Время' },
    { id: '10', sort: true, visibility: true, key: 'dayForRepair', title: 'Дн.До..' },
    { id: '11', sort: true, visibility: true, key: 'indexVan', title: 'Индекс поезда' },
    { id: '12', sort: true, visibility: true, key: 'type', title: 'Тип' },
    { id: '13', sort: true, visibility: true, key: 'description', title: 'Описание' }
  ])

  const filteredTable = ref<TableItem[]>([])

  const { getFilters, closeFilter, openFilter, saveFilter, selectedFilters, filterItems, showFilter } = useFilters({
    FILTER_NAME: 'dashboard',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const exportToExcel = () => {
    tableToExcel({
      head: tableHead.value,
      body: filteredTable.value,
      name: new Date().toString(),
      fileName: new Date().toString() + '.xls'
    })
  }

  const bigTable = () => {
    emit('bigTable')
  }

  // const page = ref<number>(1)
  // const paginationTable = ref<TableItem[]>([])

  const dateTime = (date: number) => {
    let newDate = new Date(date)
    return `${newDate.getDate().toString().padStart(2, '0')}.${(newDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${newDate.getFullYear().toString().padStart(4, '0')}&ensp;${newDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')}`
  }

  const diffDays = (date: number) => {
    const tableDate = new Date(date) as any
    const now = new Date() as any

    const diff = now - tableDate
    const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24))
    const diffInHours = Math.floor(diff / (1000 * 60 * 60)) % 24

    let result = ''
    if (diffInDays > 0) result += `${diffInDays} дн, `
    if (diffInHours > 0) result += `${diffInHours} ч`

    result = result.replace(/, $/, '')

    return result
  }

  const selectRow = (row: TableItem) => {
    emit('selectRow', row)
  }

  const getTypeName = (typeKey: string) => {
    return props.types.find((type: any) => type.type === typeKey && typeKey !== '')?.name || ''
  }

  watchEffect(() => {
    filteredTable.value =
      props.table?.sort((a: any, b: any): any => {
        if (sortType.value) {
          if (sortKey.value === 'hourForPassedWay') {
            return Number(a.hourForPassedWay) - Number(b.hourForPassedWay)
          }
          if (sortKey.value === 'dayForRepair') {
            return Number(a.dayForRepair) - Number(b.dayForRepair)
          }
          if (sortKey.value === 'date') {
            return Number(a.date) - Number(b.date)
          }
          return a[sortKey.value].localeCompare(b[sortKey.value])
        }

        if (sortKey.value === 'hourForPassedWay') {
          return Number(b.hourForPassedWay) - Number(a.hourForPassedWay)
        }
        if (sortKey.value === 'dayForRepair') {
          return Number(b.dayForRepair) - Number(a.dayForRepair)
        }
        if (sortKey.value === 'date') {
          return Number(b.date) - Number(a.date)
        }
        return b[sortKey.value].localeCompare(a[sortKey.value])
      }) || []
  })
</script>

<template>
  <div class="dashboard-table" :style="`height: ${height}px`">
    <div class="dashboard-table__wrapper">
      <div class="dashboard-table__header">
        <div class="dashboard-table__title">Таблица</div>
        <div class="dashboard-table__controllers">
          <button @click="bigTable" class="dashboard-table__controller">
            <icon :name="fullScreen ? 'minimize' : 'fullScreen'" />
          </button>
          <button @click="exportToExcel" class="dashboard-table__controller">
            <icon name="export" />
          </button>
          <button @click="openFilter" class="dashboard-table__controller">
            <icon name="settings" />
          </button>
        </div>
      </div>
      <div class="dashboard-table__table">
        <table>
          <thead>
            <tr>
              <th>
                <div>
                  <p>№</p>
                </div>
              </th>
              <template v-for="head in tableHead">
                <th v-if="head.visibility" @click="tableFilter(head.key, head.sort)">
                  <div>
                    <p>{{ head.title }}</p>
                    <icon v-if="head.sort && head.key == sortKey" :name="sortType ? 'chevronDown' : 'arrowUp'" />
                  </div>
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tableItem, index) in filteredTable">
              <td>{{ index + 1 }}</td>
              <template v-for="head in tableHead">
                <td
                  v-if="head.visibility && head.key === 'dayForRepair'"
                  :class="[
                    {
                      _danger: tableItem.dayForRepair < 0,
                      _warning: tableItem.dayForRepair <= 30 && tableItem.dayForRepair > 0,
                      _success: tableItem.dayForRepair > 30
                    }
                  ]"
                  v-html="getValue(tableItem, head.key)"
                ></td>
                <td
                  v-else-if="head.visibility && head.key === 'date'"
                  v-html="dateTime(Number(getValue(tableItem, head.key)))"
                ></td>
                <td
                  v-else-if="head.visibility && head.key === 'hourForPassedWay'"
                  v-html="diffDays(Number(getValue(tableItem, head.key)))"
                ></td>
                <td
                  v-else-if="head.visibility && head.key === 'type'"
                  @click="selectRow(tableItem)"
                  :style="`--color:${tableItem.color || ''}`"
                  v-html="getTypeName(getValue(tableItem, head.key))"
                  class="_type"
                ></td>
                <td
                  v-else-if="head.visibility && head.key === 'description'"
                  v-html="getValue(tableItem, head.key)"
                  :style="`--color:${tableItem.color || ''}`"
                  class="_type"
                ></td>
                <td v-else-if="head.visibility" v-html="getValue(tableItem, head.key)"></td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-select-checkbox
      @save="saveFilter"
      @close="closeFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      title="Фильтры"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .dashboard-table {
    width: 100%;
    height: 100%;
    overflow: hidden;
    // .dashboard-table__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    // .dashboard-table__header
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // .dashboard-table__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .dashboard-table__controllers
    &__controllers {
      display: flex;
      gap: 10px;
    }
    // .dashboard-table__controller
    &__controller {
      padding: 10px;
      color: var(--text);
      border-radius: 4px;
      background-color: var(--shade-400);
      &:hover {
        background-color: var(--primary);
        color: var(--white);
      }
    }
    // .dashboard-table__table
    &__table {
      height: 0;
      flex: 1 1;
      overflow: auto;
      border: 1px solid var(--shade-400);
      border-radius: 4px;
      table {
        width: 100%;
        border-collapse: collapse;
        thead {
          tr {
            th {
              padding: 6px 10px;
              background: var(--shade-400);
              font-weight: 600;
              font-size: 13px;
              line-height: 20px;
              position: sticky;
              z-index: 1;
              top: 0;
              div {
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
                gap: 4px;
                &:deep() {
                  svg {
                    width: 20px;
                    height: 20px;
                  }
                }
              }
            }
          }
        }
        tbody {
          tr {
            &:hover {
              td {
                background-color: var(--background);
              }
            }
            td {
              padding: 5px 10px;
              border: 1px solid var(--shade-400);
              font-size: 13px;
              line-height: 15px;

              &:first-child {
                border-left: none;
              }
              &:last-child {
                border-right: none;
              }
              &._type {
                background-color: var(--color);
              }
              &._danger {
                background-color: var(--red) !important;
                color: var(--true-black);
              }
              &._warning {
                background-color: var(--yellow) !important;
                color: var(--true-black);
              }
              &._success {
                background-color: var(--green) !important;
                color: var(--true-black);
              }
            }
          }
        }
      }
    }
  }
</style>
