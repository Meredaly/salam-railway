<script setup lang="ts">
  import { ref, watchEffect, onMounted } from 'vue'
  import { useRoute, onBeforeRouteUpdate } from 'vue-router'
  import { useCookies } from 'vue3-cookies'

  import WagonAnalysis from '../components/WagonAnalysis.vue'
  import Times from '../components/Times.vue'
  import Filters from '../components/Filters.vue'
  import Documents from '../components/Documents.vue'
  import WagonNumbers from '../components/WagonNumbers.vue'
  import DashboardTable from '../components/DashboardTable.vue'
  import StationsMap from '../components/StationsMap.vue'
  import Repair from '../components/Repair.vue'
  import PopUpUpdateRow from '../components/PopUpUpdateRow.vue'

  import { StationsTable, TableItem } from '../types'

  import stationsSortPositions from '@/helpers/stations'

  import { GET_DOCUMENTS, UPDATE_ROW } from '../api'

  const route = useRoute()
  const { cookies } = useCookies()

  const carload = ref([
    { checked: false, name: 'Груженный' },
    { checked: false, name: 'Порожний' }
  ])

  const availability = ref([
    { checked: false, name: 'Да' },
    { checked: false, name: 'Нет' }
  ])

  const types = ref([
    { checked: false, name: 'Не выбрано', type: '' },
    { checked: false, name: 'Сера', type: 'SULFUR' },
    { checked: false, name: 'Карбамид', type: 'UREA' },
    { checked: false, name: 'Подача', type: 'INNINGS' },
    { checked: false, name: 'Ремонт', type: 'REPAIR' },
    { checked: false, name: 'Операции', type: 'OPERATIONS' }
  ])

  const mainData = ref<any>({})
  const dateFrom = ref('')
  const dateBy = ref('')

  const getData = async (): Promise<void> => {
    try {
      const id = route.params?.id || 1
      const formData = {
        idDataFixing: id
      } as any

      let cookiesDate = {} as any
      dateFrom.value && (cookiesDate.dateFrom = dateFrom.value)
      dateBy.value && (cookiesDate.dateBy = dateBy.value)

      if (Object.keys(cookiesDate).length) {
        cookies.set(`date-${id}`, JSON.stringify(cookiesDate), 1000000000)
      }

      dateFrom.value && (formData.initialDate = dateFrom.value)
      dateBy.value && (formData.finalDate = dateBy.value)

      const data = await GET_DOCUMENTS({
        data: formData
      })
      mainData.value = data

      getDocuments(id.toString())
    } catch (error) {
      console.error(error)
    }
  }

  const cookiesDate = cookies.get(`date-${route?.params?.id || 1}`) as any
  if (cookiesDate) {
    dateFrom.value = cookiesDate.dateFrom
    dateBy.value = cookiesDate.dateBy
  }

  getData()

  const documents = ref<any[]>([])
  const getDocuments = (id: string): void => {
    const checkedItems = cookies.get(`documents-${id}`)?.split(',') || []
    for (const key of Object.keys(mainData.value)) {
      documents.value.push({
        name: key,
        checked: checkedItems.includes(key)
      })
    }
  }

  const mainTable = ref<TableItem[]>([])

  const stations = ref<any[]>([])
  const destinationStations = ref<any[]>([])

  const getStations = () => {
    const stationsNames = [] as string[]
    const destinationStationsNames = [] as string[]

    mainTable.value.forEach((item) => {
      //Станция
      if (!stationsNames.includes(item.currentStation)) {
        stationsNames.push(item.currentStation)
      }
      //Cтанция Назначении
      if (!destinationStationsNames.includes(item.setStation)) {
        destinationStationsNames.push(item.setStation)
      }
    })

    stations.value = createStations(stationsNames)
    destinationStations.value = createStations(destinationStationsNames)
  }

  const createStations = (stationNames: string[]) => {
    const filteredStationNames = []

    filteredStationNames.push(
      ...stationsSortPositions.filter((station: string) => {
        return stationNames.includes(station)
      })
    )
    filteredStationNames.push(
      ...stationNames.filter((station: string) => {
        return !stationsSortPositions.includes(station)
      })
    )

    return filteredStationNames.map((station) => ({
      checked: false,
      name: station
    }))
  }

  const selectFromDate = (date: string) => {
    dateFrom.value = date
    getData()
  }
  const selectByDate = (date: string) => {
    dateBy.value = date
    getData()
  }

  const wagonNumbers = ref<string[]>([])
  const checkedWagonNumbers = ref<string[]>([])

  const checkWagonNumber = (number: string) => {
    if (checkedWagonNumbers.value.includes(number)) {
      checkedWagonNumbers.value = checkedWagonNumbers.value.filter((wagonNumber) => wagonNumber !== number)
    } else {
      checkedWagonNumbers.value.push(number)
    }
  }

  interface SelectedStation {
    station: StationsTable
    type: string
  }

  const stationsTable = ref<StationsTable[]>([])
  const selectedStationsTable = ref<any>({})

  const checkStationTableItem = ({ station, type }: SelectedStation) => {
    if (type === 'ALL') {
      let status = true
      if (selectedStationsTable.value[station.name]) {
        status = !(selectedStationsTable.value[station.name].gruz && selectedStationsTable.value[station.name].por)
      }
      selectedStationsTable.value[station.name] = {
        gruz: status,
        por: status
      }
    }
    if (type === 'GRUZ') {
      selectedStationsTable.value[station.name] = {
        gruz: !selectedStationsTable.value[station.name]?.gruz,
        por: !!selectedStationsTable.value[station.name]?.por
      }
    }
    if (type === 'POR') {
      selectedStationsTable.value[station.name] = {
        gruz: !!selectedStationsTable.value[station.name]?.gruz,
        por: !selectedStationsTable.value[station.name]?.por
      }
    }
    if (!selectedStationsTable.value[station.name].gruz && !selectedStationsTable.value[station.name].por) {
      delete selectedStationsTable.value[station.name]
    }
  }

  const wagonLoadAnalysis = ref({
    gruz: 0,
    por: 0
  })

  const operations = ref<any>({
    'CДAЧA HA ИHOCTAHHУЮ Ж.Д.': 0,
    'BKЛЮЧEHИE BAГOHA B ПOEЗД': 0,
    'ИCKЛЮЧEHИE BAГOHA ИЗ ПOEЗДA': 0,
    ПРОЧИЕ: 0
  })
  const repair = ref({
    danger: 0,
    warning: 0,
    success: 0,
    unknown: 0
  })

  const clearAll = () => {
    wagonLoadAnalysis.value.gruz = 0
    wagonLoadAnalysis.value.por = 0
    operations.value = {
      'CДAЧA HA ИHOCTAHHУЮ Ж.Д.': 0,
      'BKЛЮЧEHИE BAГOHA B ПOEЗД': 0,
      'ИCKЛЮЧEHИE BAГOHA ИЗ ПOEЗДA': 0,
      ПРОЧИЕ: 0
    }
    repair.value = {
      danger: 0,
      warning: 0,
      success: 0,
      unknown: 0
    }
    wagonNumbers.value = []
  }

  const table = ref<TableItem[]>([])
  watchEffect(() => {
    clearAll()

    const newStationsTable = {} as any

    stations.value.forEach((s) => {
      newStationsTable[s.name] = {
        por: 0,
        gruz: 0
      }
    })
    const selectedTypes = types.value.filter((type) => type.checked).map((type) => type.type)

    // Таблица
    table.value = mainTable.value.filter((tableItem: TableItem) => {
      tableItem.color = tableItem.color || ''
      tableItem.type = tableItem.type || ''
      tableItem.description = tableItem.description || ''

      // Проверка выбранные станции
      if (stations.value.some((station) => station.checked)) {
        if (!stations.value.some((station) => station.name === tableItem.currentStation && station.checked)) {
          return false
        }
      }

      // Проверка выбранные станции назначения
      if (destinationStations.value.some((station) => station.checked)) {
        if (!destinationStations.value.some((station) => station.name === tableItem.setStation && station.checked)) {
          return false
        }
      }

      // Проверка Тип
      if (selectedTypes.length) {
        if (!selectedTypes.includes(tableItem.type)) {
          return false
        }
      }

      // Наличие Акта Приема
      // if (availability.value.some((availabilityItem) => availabilityItem.checked)) {
      //   if (
      //     !availability.value.some(
      //       (availabilityItem) =>
      //         availabilityItem.name === `${tableItem.act ? 'Да' : 'Нет'}` && availabilityItem.checked
      //     )
      //   ) {
      //     return false
      //   }
      // }

      // Загруженность Вагона
      if (carload.value.some((carloadItem) => carloadItem.checked)) {
        if (!carload.value.some((carloadItem) => carloadItem.name === tableItem.typeVan && carloadItem.checked)) {
          return false
        }
      }

      // № Вагон
      if (!wagonNumbers.value.includes(tableItem.numberVan)) {
        wagonNumbers.value = [...wagonNumbers.value, tableItem.numberVan]
      }

      // Проверка выбренного вагона
      if (checkedWagonNumbers.value.length && !checkedWagonNumbers.value.includes(tableItem.numberVan)) {
        return false
      }

      // Таблица
      if (tableItem.typeVan === 'Порожний') {
        newStationsTable[tableItem.currentStation] = {
          por: (newStationsTable[tableItem.currentStation]?.por || 0) + 1,
          gruz: newStationsTable[tableItem.currentStation]?.gruz || 0
        }
      } else if (tableItem.typeVan === 'Груженный') {
        newStationsTable[tableItem.currentStation] = {
          por: newStationsTable[tableItem.currentStation]?.por || 0,
          gruz: (newStationsTable[tableItem.currentStation]?.gruz || 0) + 1
        }
      }

      // Проверка выбранных статус санций
      if (Object.getOwnPropertyNames(selectedStationsTable.value).length) {
        if (
          !(
            (selectedStationsTable.value[tableItem.currentStation]?.gruz && tableItem.typeVan === 'Груженный') ||
            (selectedStationsTable.value[tableItem.currentStation]?.por && tableItem.typeVan === 'Порожний')
          )
        ) {
          return false
        }
      }

      // Документ
      const stationsTableRow = stationsTable.value.find(
        (station: StationsTable): boolean => station.name === tableItem.currentStation
      )
      stationsTableRow && tableItem.typeVan === 'Порожний'
        ? stationsTableRow.por++
        : stationsTableRow && tableItem.typeVan === 'Груженный'
        ? stationsTableRow.gruz++
        : null

      //  Анализ загруженности вагонов
      if (tableItem.typeVan === 'Порожний') {
        wagonLoadAnalysis.value.por += 1
      } else if (tableItem.typeVan === 'Груженный') {
        wagonLoadAnalysis.value.gruz += 1
      }

      // Операция
      if (operations.value[tableItem.statusVan] !== undefined) {
        operations.value[tableItem.statusVan] += 1
      } else {
        operations.value['ПРОЧИЕ'] += 1
      }

      // Дней до ремонта
      if (tableItem.dayForRepair < 0) repair.value.danger += 1
      if (tableItem.dayForRepair <= 30 && tableItem.dayForRepair >= 0 && tableItem.dayForRepair !== null)
        repair.value.warning += 1
      if (tableItem.dayForRepair > 30) repair.value.success += 1
      if (tableItem.dayForRepair === null) repair.value.unknown += 1

      tableItem.hourForPassedWay = Number(tableItem.date)

      return true
    })

    stationsTable.value = []

    for (let [key, value] of Object.entries(newStationsTable)) {
      stationsTable.value.push({
        name: key,
        gruz: (value as any)?.gruz,
        por: (value as any)?.por
      })
    }
  })

  watchEffect(() => {
    if (documents.value.some((document) => document.checked)) {
      const checkedDocumentNames =
        documents.value
          .filter((document) => document.checked)
          .map((document) => document.name)
          .join(',') || ''
      cookies.set(`documents-${route.params.id || 1}`, checkedDocumentNames, 1000000000)
    }
    mainTable.value = []
    for (const [key, value] of Object.entries(mainData.value)) {
      if (
        documents.value.some((document) => document.name === key && document.checked) ||
        documents.value.every((document) => !document.checked)
      )
        mainTable.value.push(
          ...(value as any).map((tableItem: any) => {
            return {
              ...tableItem,
              act: tableItem.act ? 'Да' : 'Нет'
            }
          })
        )
    }
    getStations()
  })

  onBeforeRouteUpdate(async (to, from) => {
    if (to.params.id !== from.params.id) {
      documents.value = []
      setTimeout(() => {
        getData()
      }, 0)
    }
  })

  const isBigTable = ref<boolean>(false)
  const bigTable = () => {
    isBigTable.value = !isBigTable.value
  }

  const dashboardTable = ref<HTMLElement | null>(null)
  const tableHeight = ref<number>(0)
  watchEffect(() => {
    if (isBigTable.value) {
      tableHeight.value = 0
    } else {
      tableHeight.value = 0
    }
    setTimeout(() => {
      let height = dashboardTable.value?.scrollHeight ? dashboardTable.value?.scrollHeight - 28 : 0
      height = height < 450 ? 450 : height
      tableHeight.value = height
    }, 0)
  })

  onMounted(() => {
    window.addEventListener(
      'resize',
      () => {
        setTimeout(() => {
          tableHeight.value = 0

          let height = dashboardTable.value?.scrollHeight ? dashboardTable.value?.scrollHeight - 28 : 0
          height = height < 300 ? 300 : height
          tableHeight.value = height
        }, 0)
      },
      true
    )
  })
  const resetAll = () => {
    resetDocuments()
    resetWagonNumbers()
    dateFrom.value = ''
    dateBy.value = ''
    cookies.remove(`date-${route.params?.id || 1}`)
    carload.value.forEach((item) => {
      item.checked = false
    })
    availability.value.forEach((item) => {
      item.checked = false
    })
    stations.value.forEach((item) => {
      item.checked = false
    })
    destinationStations.value.forEach((item) => {
      item.checked = false
    })
    getData()
  }

  const resetDocuments = () => {
    cookies.remove(`documents-${route.params?.id || 1}`)
    documents.value.forEach((item) => {
      item.checked = false
    })
    selectedStationsTable.value = {}
  }

  const resetWagonNumbers = () => {
    checkedWagonNumbers.value = []
  }

  const showPopUpRow = ref(false)
  const openPopUpRow = () => {
    showPopUpRow.value = true
  }
  const closePopUpRow = () => {
    showPopUpRow.value = false
  }

  const selectedRow = ref<null | TableItem>(null)
  const selectRow = (row: TableItem) => {
    selectedRow.value = row
    openPopUpRow()
  }

  const loadingRow = ref(false)

  const updateRow = async (form: any) => {
    try {
      loadingRow.value = true
      await UPDATE_ROW({
        data: {
          id: selectedRow.value?.id,
          ...form
        }
      })
      for (const key of Object.keys(mainData.value)) {
        mainData.value[key].forEach((item: any) => {
          if (selectedRow.value?.id === item.id) {
            item.color = form.color
            item.description = form.description
            item.type = form.type
          }
        })
      }

      mainTable.value.forEach((item: TableItem) => {
        if (selectedRow.value?.id === item.id) {
          item.color = form.color
          item.description = form.description
          item.type = form.type
        }
      })
      closePopUpRow()
    } catch (error) {
      console.error(error)
    } finally {
      loadingRow.value = false
    }
  }
</script>

<template>
  <div class="dashboard">
    <div :class="['dashboard__wrapper', { 'dashboard__wrapper_big-table': isBigTable }]">
      <template v-if="!isBigTable">
        <div class="dashboard__wagon-analysis __box">
          <wagon-analysis :wagon-load-analysis="wagonLoadAnalysis" />
        </div>
        <div class="dashboard__time __box">
          <times @select-from="selectFromDate" @select-by="selectByDate" :dateFrom="dateFrom" :dateBy="dateBy" />
        </div>
        <div class="dashboard__filters __box">
          <filters
            @reset="resetAll"
            :stations="stations"
            :destinationStations="destinationStations"
            :carload="carload"
            :types="types"
          />
        </div>
        <div class="dashboard__documents __box">
          <documents
            @reset="resetDocuments"
            @check="checkStationTableItem"
            :documents="documents"
            :stations="stationsTable"
            :selectedStations="selectedStationsTable"
          />
        </div>
        <div class="dashboard__wagon-numbers __box">
          <wagon-numbers
            @reset="resetWagonNumbers"
            @check-wagon-number="checkWagonNumber"
            :wagon-numbers="wagonNumbers"
            :checked-wagon-numbers="checkedWagonNumbers"
          />
        </div>
        <div class="dashboard__wagon-diagram __box">
          <stations-map
            @check="checkStationTableItem"
            :stations="stationsTable"
            :selected-stations="selectedStationsTable"
          />
        </div>
        <div class="dashboard__wagon-diagram __box">
          <repair :repair="repair" />
        </div>
      </template>
      <div class="dashboard__table __box" ref="dashboardTable">
        <dashboard-table
          @bigTable="bigTable"
          @selectRow="selectRow"
          :fullScreen="isBigTable"
          :table="table"
          :types="types"
          :height="tableHeight"
        />
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-update-row
      v-if="showPopUpRow"
      @close="closePopUpRow"
      @save="updateRow"
      :loading="loadingRow"
      :item="selectedRow"
      :types="types"
    />
  </teleport>
</template>

<style scoped lang="scss">
  .dashboard {
    height: 100%;
    overflow-y: auto;
    // .dashboard__wrapper
    &__wrapper {
      padding: 20px;
      width: 100%;
      min-height: 100vh;
      display: grid;
      grid-template-columns: 500px 200px 2fr 1fr;
      grid-template-rows: 218px 450px 1fr;
      grid-gap: 20px;
      &_big-table {
        grid-template-rows: 1fr;
      }
    }
    // .dashboard__wagon-analysis
    &__wagon-analysis {
      height: 218px;
    }
    // .dashboard__time
    &__time {
      height: 218px;
    }
    // .dashboard__filters
    &__filters {
      grid-column-start: span 2;
      height: 218px;
    }
    // .dashboard__documents
    &__documents {
    }
    // .dashboard__wagon-numbers
    &__wagon-numbers {
    }
    // .dashboard__wagon-diagram
    &__wagon-diagram {
    }
    // .dashboard__table
    &__table {
      grid-column-start: span 4;
    }
  }
  .__box {
    background: var(--white);
    border-radius: 10px;
    padding: 14px;
  }
</style>
