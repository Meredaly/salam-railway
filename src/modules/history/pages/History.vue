<script setup lang="ts">
  import { ref, computed } from 'vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import Datepicker from '@/UI/Datepicker'
  import DropdownCheckbox from '@/UI/DropdownCheckbox.vue'

  import { History, Logistician } from '../types'
  import { useStations } from '@/store/stations'

  import { GET_HISTORY, GET_LOGISTICS, DELETE_HISTORY } from '../api'

  const stations = useStations()

  const historiesData = ref<History[]>([])
  const getHistory = async (): Promise<void> => {
    try {
      const response = await GET_HISTORY({})
      historiesData.value = response.reverse()
    } catch (error) {
      console.error(error)
    }
  }
  getHistory()

  const deleteHistory = async (history: History) => {
    try {
      await DELETE_HISTORY({
        data: {
          idExcelFile: history.id
        }
      })

      history.idDataFixing = null
      history.status = false
    } catch (error) {
      console.error(error)
    }
  }

  const logisticians = ref<Logistician[]>([])
  const getLogistics = async () => {
    try {
      const response = await GET_LOGISTICS()
      logisticians.value = response.map((logistician: Logistician) => {
        return {
          ...logistician,
          checked: false
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getLogistics()

  const searchLogistician = (id: number) => {
    let logistician = logisticians.value.find((logistician: Logistician) => logistician.id === id)
    return logistician ? `${logistician.name} ${logistician.surname}` : ''
  }

  const searchLogisticianCompony = (id: number | null) => {
    if (id === 1) return 'Hazar logistika'
    return (stations.getStations?.find((station: any): boolean => station.id === id) as any)?.name || ''
  }

  const moreMenu = ref([{ id: 'DELETE', name: 'Удалить' }])

  const selectAction = (history: History, action: any) => {
    if (action.id === 'DELETE') {
      history
      deleteHistory(history)
    }
  }

  const dateTime = (date: number) => {
    let newDate = new Date(date)
    return `${newDate.getDate().toString().padStart(2, '0')}.${(newDate.getMonth() + 1).toString().padStart(2, '0')}.${newDate
      .getFullYear()
      .toString()
      .padStart(4, '0')}&ensp;${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')}`
  }

  const histories = computed(() => {
    const isAllNoChecked = logisticians.value.every((logistician) => !logistician.checked)
    if (isAllNoChecked) {
      return historiesData.value
    }
    return historiesData.value.filter((history) =>
      logisticians.value.some((logistician) => logistician.checked === true && logistician.id === history.userId)
    )
  })
</script>

<template>
  <div class="accounts">
    <div class="accounts__wrapper">
      <div class="accounts__head">
        <div class="accounts__title">История</div>
        <div class="accounts__controllers">
          <datepicker label="С" width="150" />
          <datepicker label="По" width="150" />
          <dropdown-checkbox :items="logisticians" label="Пользователи" placeholder="Все" width="300" />
        </div>
      </div>
      <div class="accounts__body">
        <div class="accounts__table">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Пользователь</th>
                <th>Названия логистики</th>
                <th>Имя файла</th>
                <th>Время добовления</th>
                <th width="1">Действие</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in histories" :key="history.id">
                <td>{{ index + 1 }}</td>
                <td>{{ searchLogistician(history.userId) }}</td>
                <td>{{ searchLogisticianCompony(history.idDataFixing) }}</td>
                <td>{{ history.name }}</td>
                <td v-html="dateTime(history.created)"></td>
                <td>
                  <dropdown-dots v-if="history.status" @select-item="(action) => selectAction(history, action)" :items="moreMenu" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .accounts {
    padding: 20px;
    width: 100%;
    height: 100%;
    // .accounts__wrapper
    &__wrapper {
      background: var(--white);
      border-radius: 10px;
      padding: 14px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    // .accounts__head
    &__head {
    }
    // .accounts__title
    &__title {
      font-size: 34px;
      line-height: 40px;
      font-weight: 600;
    }
    // .accounts__controllers
    &__controllers {
      margin-top: 20px;
      display: flex;
      gap: 20px;
    }
    // .accounts__body
    &__body {
      height: 0;
      flex: 1 1;
      overflow: auto;
    }
    // .accounts__table
    &__table {
      width: 100%;
      table {
        width: 100%;
        border-collapse: collapse;
        thead {
          tr {
            th {
              text-align: left;
              padding: 20px 10px;
              font-size: 16px;
              font-weight: 600;
              background-color: var(--shade-400);
            }
          }
        }
        tbody {
          tr {
            td {
              text-align: left;
              padding: 4px 10px;
              border-bottom: 1px solid var(--shade-400);
              font-size: 14px;
              line-height: 38px;
              cursor: pointer;
            }
            &:hover {
              td {
                background-color: var(--background);
              }
            }
          }
        }
      }
    }
  }
</style>
