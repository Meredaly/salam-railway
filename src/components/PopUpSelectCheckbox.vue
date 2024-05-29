<script setup lang="ts">
  import { ref, watchEffect } from 'vue'

  import type { PropType } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import MyButton from '@/UI/MyButton.vue'
  import Icon from '@/UI/Icon'

  import { SelectCheckboxItem } from '@/types'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    title: { type: String, default: '' },
    items: { type: Array as PropType<SelectCheckboxItem[]>, default: () => [] },
    selectedItems: { type: Array as PropType<SelectCheckboxItem[]>, default: () => [] }
  })

  const checkedSelectedItems = ref<SelectCheckboxItem[]>([])
  watchEffect(() => {
    checkedSelectedItems.value = JSON.parse(JSON.stringify(props.selectedItems))
  })

  const selectItem = (item: SelectCheckboxItem) => {
    if (isChecked(item)) {
      checkedSelectedItems.value = checkedSelectedItems.value.filter((selectedCheckboxItem) => selectedCheckboxItem.id !== item.id)
    } else {
      checkedSelectedItems.value.push(item)
    }
  }

  const isChecked = (item: SelectCheckboxItem): boolean => {
    return checkedSelectedItems.value.some((selectedCheckboxItem) => selectedCheckboxItem.id === item.id)
  }

  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save', checkedSelectedItems.value)
  }
</script>

<template>
  <pop-up-body @close="close" :title="title" width="500">
    <my-row>
      <my-col cols="12">
        <div class="pop-up-select __custom-scroll">
          <div class="pop-up-select__items">
            <button v-for="item in items" :key="item.id" @click="selectItem(item)" :class="['pop-up-select__item', { _active: isChecked(item) }]">
              <div class="pop-up-select__check">
                <icon :name="isChecked(item) ? 'checked' : 'unchecked'" />
              </div>
              <p>{{ item.name }}</p>
            </button>
          </div>
        </div>
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-10">
        <my-button @click="close" title="Отмена" styles="gray" />
        <my-button @click="save" title="Сохранить" />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped lang="scss">
  .pop-up-select {
    max-height: 528px;
    overflow: auto;
    // .pop-up-select__items
    &__items {
    }
    // .pop-up-select__item
    &__item {
      display: block;
      font-style: normal;
      font-size: 14px;
      line-height: 20px;
      color: var(--text);
      padding: 10px 20px;
      background-color: var(--white);
      width: 100%;
      margin-bottom: 1px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      &:hover {
        background-color: var(--shade-400);
      }
      &._active {
        .pop-up-select__check {
          color: var(--primary);
        }
      }
      &:not(:first-child) {
        border-top: 1px solid var(--shade-400);
      }
    }
    // .pop-up-select__check
    &__check {
      margin-right: 10px;
    }
  }
</style>
