<script setup lang="ts">
  import { ref } from 'vue'
  import MyButton from '@/UI/MyButton.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpAccount from '../components/PopUpAccount.vue'

  import { Account } from '../types'

  import { EDIT_USER, GET_USERS, ADD_USER, DELETE_USER } from '../api'

  const accounts = ref<Account[]>([])
  const getAccounts = async (): Promise<void> => {
    try {
      const response = await GET_USERS()
      accounts.value = response
    } catch (error) {
      console.error(error)
    }
  }
  getAccounts()

  const loading = ref<boolean>(false)
  const saveAccount = async (form: any): Promise<void> => {
    try {
      loading.value = true
      const newForm = {
        name: form.name,
        surname: form.surname,
        email: form.email
      } as any
      if (!!form.password) {
        newForm.password = form.password
      }
      if (form.id) {
        newForm.id = form.id
        await EDIT_USER({ data: newForm })
      } else {
        await ADD_USER({ data: newForm })
      }
      closePopUpAccount()
      getAccounts()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteAccount = async (account: Account) => {
    try {
      await DELETE_USER({
        data: {
          id: account.id
        }
      })
      getAccounts()
    } catch (error) {
      console.error(error)
    }
  }

  const selectedAccount = ref<Account | null>(null)
  const selectAccount = (account: Account): void => {
    selectedAccount.value = account
    openPopUpAccount()
  }

  const showPopUpAccount = ref<boolean>(false)
  const openPopUpAccount = () => {
    showPopUpAccount.value = true
  }
  const closePopUpAccount = () => {
    showPopUpAccount.value = false

    selectedAccount.value = null
  }

  const moreMenu = ref([
    { id: 'EDIT', name: 'Редактировать' },
    { id: 'DELETE', name: 'Удалить' }
  ])

  const selectAction = (account: Account, action: any) => {
    if (action.id === 'EDIT') {
      selectAccount(account)
    }
    if (action.id === 'DELETE') {
      deleteAccount(account)
    }
  }
</script>

<template>
  <div class="accounts">
    <div class="accounts__wrapper">
      <div class="accounts__head">
        <div class="accounts__title">Пользователи</div>
        <div class="accounts__controllers">
          <my-button @click="openPopUpAccount" prevIcon="add" title="Добавить" />
        </div>
      </div>
      <div class="accounts__body">
        <div class="accounts__table">
          <table>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Почта</th>
                <th width="1">Действие</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in accounts" :key="account.id">
                <td @click="selectAccount(account)">{{ account.name }}</td>
                <td @click="selectAccount(account)">{{ account.surname }}</td>
                <td @click="selectAccount(account)">{{ account.email }}</td>
                <td>
                  <dropdown-dots @select-item="(action) => selectAction(account, action)" :items="moreMenu" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-account @close="closePopUpAccount" @save="saveAccount" v-if="showPopUpAccount" :item="selectedAccount" :loading="loading" />
  </teleport>
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
