<script setup lang="ts">
  import { computed } from 'vue'
  import type { PropType } from 'vue'
  import Icon from '@/UI/Icon'
  import { useDropdown } from '@/composables/dropdown'

  const props = defineProps({
    label: { type: String, default: null },
    placeholder: { type: String, default: null },
    items: { type: Array as PropType<any[]>, default: () => [] },
    width: { type: String, default: null }
  })

  const { dropdownBody, dropdownMenu, showDropdown, openDropdown, closeDropdown } = useDropdown()

  const checkItem = (item: any) => {
    item.checked = !item.checked
  }

  const checkedItemsName = computed((): string => {
    return props.items
      .filter((item: any) => item.checked)
      .map((item: any) => item.name)
      .join(', ')
  })
</script>

<template>
  <div
    class="dropdown-checkbox"
    ref="dropdownBody"
    :style="{
      width: props.width ? `${props.width}px` : ''
    }"
  >
    <div class="dropdown-checkbox__label">{{ label }}</div>
    <button @click="showDropdown ? closeDropdown() : openDropdown()" class="dropdown-checkbox__button">
      <div v-if="!!checkedItemsName" class="dropdown-checkbox__text">{{ checkedItemsName }}</div>
      <div v-else class="dropdown-checkbox__placeholder">{{ placeholder }}</div>
      <div class="dropdown-checkbox__button-arrow">
        <icon name="arrowDown" />
      </div>
    </button>
    <div v-if="showDropdown" ref="dropdownMenu" class="dropdown-checkbox__menu">
      <div class="checkbox-menu">
        <div class="checkbox-menu__list">
          <button
            v-for="item in items"
            @click="checkItem(item)"
            :class="['checkbox-menu__item', { 'checkbox-menu__item_active': item.checked }]"
          >
            <icon :name="item.checked ? 'checked' : 'unchecked'" />
            <p>{{ item.name }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .dropdown-checkbox {
    position: relative;
    // .dropdown-checkbox__label
    &__label {
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: var(--text);
    }
    // .dropdown-checkbox__button
    &__button {
      margin-top: 4px;
      background: var(--background);
      border: 1px solid var(--shade-400);
      border-radius: 4px;
      display: flex;
      width: 100%;
      padding: 12px 10px;
    }
    // .dropdown-checkbox__text
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
    // .dropdown-checkbox__placeholder
    &__placeholder {
      flex: 1 1;
      width: 0;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: var(--gray);
      text-align: left;
    }
    // .dropdown-checkbox__button-arrow
    &__button-arrow {
      color: var(--text);
    }
    // .dropdown-checkbox__menu
    &__menu {
      position: absolute;
      left: 0;
      width: 100%;
      z-index: 3;
      top: calc(100% + 5px);
    }
  }

  .checkbox-menu {
    background-color: var(--white);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-height: 300px;
    overflow-y: auto;
    // .checkbox-menu__list
    &__list {
    }
    // .checkbox-menu__item
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
        padding-left: 10px;
        font-size: 14px;
        line-height: 20px;
        color: var(--text);
      }

      // .checkbox-menu__item_active
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
