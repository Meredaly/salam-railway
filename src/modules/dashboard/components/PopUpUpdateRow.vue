<script setup lang="ts">
  import { PropType, computed, ref } from 'vue'

  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import MyButton from '@/UI/MyButton.vue'
  import TextArea from '@/UI/TextArea.vue'
  import Dropdown from '@/UI/Dropdown.vue'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    types: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    item: { type: Object as PropType<any>, default: () => {} }
  })

  const formRow = ref({
    type: props.item?.type || '',
    color: props.item?.color || '',
    description: props.item?.description || ''
  })

  const selectedType = computed(() => {
    return props.types?.find((type: any) => type.type === formRow.value.type) || null
  })
  const selectType = (type: any) => {
    formRow.value.type = type.type
  }

  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F333FF',
    '#a0d2db',
    '#F5FF33',
    '#FF33A6',
    '#33FFA6',
    '#FFA633'
  ] as string[]

  const selectColor = (color: string) => {
    formRow.value.color = color === formRow.value.color ? '' : color
  }

  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save', formRow.value)
  }
</script>

<template>
  <pop-up-body @close="close" title="Обновить строку" width="500">
    <my-row>
      <my-col cols="12">
        <dropdown
          @select-item="selectType"
          :selected-item="selectedType"
          :disabled="loading"
          :items="types"
          label="Тип"
        />
      </my-col>
      <my-col cols="12">
        <div class="colors">
          <div class="colors__items">
            <button
              v-for="color in colors"
              :key="color"
              @click="selectColor(color)"
              :class="['colors__item', { colors__item_active: formRow.color === color }]"
            >
              <span :style="`--color: ${color}`"></span>
            </button>
          </div>
        </div>
      </my-col>
      <my-col cols="12">
        <text-area v-model="formRow.description" :disabled="loading" label="Описание" />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-10">
        <my-button @click="close" :disabled="loading" title="Отмена" styles="gray" />
        <my-button @click="save" :disabled="loading" title="Сохранить" />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped lang="scss">
  .colors {
    width: 100%;
    // .colors__items
    &__items {
      display: flex;
      justify-content: space-between;
    }
    // .colors__item
    &__item {
      border: 2px solid transparent;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        border-radius: 50%;
        display: block;
        width: 34px;
        height: 34px;
        background-color: var(--color, #ffffff);
      }
      // .colors__item_active
      &_active {
        border-color: #000000;
      }
    }
  }
</style>
