<script setup lang="ts">
  import type { PropType } from 'vue'
  import Icon from '@/UI/Icon'
  import { useDropdown } from '@/composables/dropdown'

  const emit = defineEmits(['selectItem'])

  const props = defineProps({
    label: { type: String, default: null },
    placeholder: { type: String, default: null },
    items: { type: Array as PropType<any[]>, default: () => [] },
    selectedItem: { type: Object as PropType<any>, default: () => {} },
    width: { type: String, default: null },
    disabled: { type: Boolean, default: false }
  })

  const { dropdownBody, dropdownMenu, showDropdown, openDropdown, closeDropdown } = useDropdown()

  const selectItem = (item: any) => {
    emit('selectItem', item)
    closeDropdown()
  }
</script>

<template>
  <div
    class="dropdown"
    ref="dropdownBody"
    :style="{
      width: props.width ? `${props.width}px` : ''
    }"
  >
    <div class="dropdown__label">{{ label }}</div>
    <button @click="showDropdown ? closeDropdown() : openDropdown()" :disabled="disabled" class="dropdown__button">
      <div v-if="!!selectedItem" class="dropdown__text">{{ selectedItem.name }}</div>
      <div v-else class="dropdown__placeholder">{{ placeholder }}</div>
      <div class="dropdown__button-arrow">
        <icon name="arrowDown" />
      </div>
    </button>
    <div v-if="showDropdown" ref="dropdownMenu" class="dropdown__menu">
      <div class="item-menu">
        <div class="item-menu__list">
          <button v-for="item in items" @click="selectItem(item)" class="item-menu__item">
            <p>{{ item.name }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .dropdown {
    position: relative;
    // .dropdown__label
    &__label {
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: var(--text);
      margin-bottom: 4px;
    }
    // .dropdown__button
    &__button {
      background: var(--background);
      border: 1px solid var(--shade-400);
      border-radius: 4px;
      display: flex;
      width: 100%;
      padding: 12px 10px;
    }
    // .dropdown__text
    &__text {
      flex: 1 1;
      width: 0;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: var(--text);
      text-align: left;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    // .dropdown__placeholder
    &__placeholder {
      flex: 1 1;
      width: 0;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: var(--gray);
      text-align: left;
    }
    // .dropdown__button-arrow
    &__button-arrow {
      color: var(--text);
    }
    // .dropdown__menu
    &__menu {
      position: absolute;
      left: 0;
      width: 100%;
      z-index: 3;
      top: calc(100% + 5px);
    }
  }

  .item-menu {
    background-color: var(--white);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-height: 300px;
    overflow-y: auto;
    // .item-menu__list
    &__list {
    }
    // .item-menu__item
    &__item {
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
      background-color: transparent;
      padding: 10px;
      &:deep() {
        .icon {
          color: var(--gray);
        }
      }
      p {
        font-size: 14px;
        line-height: 20px;
        color: var(--text);
      }

      // .item-menu__item_active
      &_active {
        &:deep() {
          .icon {
            color: var(--primary);
          }
        }
      }
      &:hover {
        background-color: var(--shade-400);
      }
    }
  }
</style>
