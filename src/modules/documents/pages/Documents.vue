<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useStations } from '@/store/stations'
  import { useAuth } from '@/store/auth'

  import Dropdown from '@/UI/Dropdown.vue'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'

  import { ADD_PW, ADD_ACT } from '../api'

  const auth = useAuth()

  const fileTypes = ref([
    { id: 1, name: 'ПВ' },
    { id: 2, name: 'Акты Ремонт' }
  ])
  const selectedFileType = ref({ id: 1, name: 'ПВ' })
  const selectFileType = (type: any) => {
    selectedFileType.value = type
  }

  const stations = computed(() => [{ id: 1, name: 'Hazar logistik' }, ...useStations().getStations])

  const selectedStation = ref({ id: 1, name: 'Hazar logistik' })
  const selectStation = (station: any) => {
    selectedStation.value = station
  }

  const message = ref<string>('')
  const file = ref<File | null>(null)
  const selectFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files?.length) {
      file.value = target?.files[0]
      error.value = false
      message.value = ''
    }
  }

  const error = ref<boolean>(false)
  const loading = ref<boolean>(false)

  const importFile = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = false

      let response = null as any
      if (selectedFileType.value.id === 1) {
        response = await ADD_PW({
          data: {
            userId: auth.getUser.id,
            idDataFixing: selectedStation.value.id,
            excelFile: file.value
          }
        })
      } else {
        response = await ADD_ACT({
          data: {
            userId: auth.getUser.id,
            dataFixingId: selectedStation.value.id,
            excelFile: file.value
          }
        })
      }
      if (response?.status) {
        file.value = null
      } else {
        error.value = true
        message.value = 'Не сотвестуший вид файла'
      }
    } catch (err) {
      console.error(err)
      error.value = true
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="import-files">
    <div class="import-files__wrapper">
      <div class="import-files__title">Импортировать файл excel</div>
      <div class="import-files__form">
        <div class="import-files__dropdown">
          <dropdown :disabled="loading" @select-item="selectFileType" :selected-item="selectedFileType" :items="fileTypes" label="Тип файла" />
        </div>
        <div class="import-files__dropdown">
          <dropdown :disabled="loading" @select-item="selectStation" :selected-item="selectedStation" :items="stations" label="Кому" />
        </div>
        <label :class="['import-files__file', { _error: error }]">
          <div class="import-files__file-title">Выберите файл excel</div>
          <div class="import-files__icon">
            <icon name="documentAdd" />
          </div>
          <div class="import-files__file-name">
            <p>{{ file?.name }}</p>
          </div>
          <input @change="selectFile" :disabled="loading" type="file" />
        </label>
        <div v-if="message" class="import-files__message">{{ message }}</div>
        <div class="import-files__save">
          <my-button @click="importFile" :disabled="loading" :loading="loading" block title="Импорт" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .import-files {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // .import-files__wrapper
    &__wrapper {
      background: var(--white);
      border-radius: 10px;
      padding: 20px;
      width: 500px;
    }
    // .import-files__title
    &__title {
      font-size: 24px;
      font-weight: 600;
      text-align: center;
    }
    // .import-files__form
    &__form {
      margin-top: 40px;
    }
    // .import-files__dropdown
    &__dropdown {
      margin-top: 20px;
    }
    // .import-files__file
    &__file {
      margin-top: 20px;
      cursor: pointer;
      border: 1px dashed var(--shade-400);
      background-color: var(--background);
      display: block;
      border-radius: 10px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      input {
        display: none;
      }
      &._error {
        border-color: var(--red);
        background-color: var(--red-500);
      }
    }
    // .import-files__file-title
    &__file-title {
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      color: var(--text);
    }
    // .import-files__icon
    &__icon {
      margin-top: 20px;
      color: var(--primary);
      &:deep() {
        svg {
          width: 50px;
          height: 50px;
        }
      }
    }
    // .import-files__file-name
    &__file-name {
      height: 20px;
      font-size: 14px;
      line-height: 20px;
      text-align: left;
      width: 100%;
      margin-top: 10px;
      p {
        width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    // .import-files__save
    &__save {
      margin-top: 20px;
    }
    &__message {
      font-size: 14px;
      line-height: 24px;
      color: var(--red);
    }
  }
</style>
