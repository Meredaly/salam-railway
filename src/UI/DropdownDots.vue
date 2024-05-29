<script setup lang="ts">
  import type { PropType } from 'vue'
  import Icon from '@/UI/Icon'
  import { useDropdown } from '@/composables/dropdown'

  const emit = defineEmits(['selectItem'])
  defineProps({
    items: { type: Array as PropType<any[]>, default: () => [] }
  })

  const { dropdownBody, dropdownMenu, showDropdown, openDropdown, closeDropdown } = useDropdown()

  const selectItem = (item: any) => {
    emit('selectItem', item)
  }
</script>

<template>
  <div class="dropdown-dots" ref="dropdownBody">
    <button @click="showDropdown ? closeDropdown() : openDropdown()" class="dropdown-dots__button">
      <icon name="moreVertical" />
    </button>
    <div v-if="showDropdown" ref="dropdownMenu" class="dropdown-dots__menu">
      <div class="dots-menu">
        <div class="dots-menu__list">
          <button v-for="item in items" @click="selectItem(item)" class="dots-menu__item">
            <p>{{ item.name }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .dropdown-dots {
    position: relative;
    width: fit-content;
    // .dropdown-dots__button
    &__button {
      background: var(--background);
      border: 1px solid var(--shade-400);
      border-radius: 4px;
      display: flex;
      padding: 6px;
      color: var(--text);
    }
    // .dropdown-dots__menu
    &__menu {
      position: absolute;
      right: 0;
      width: fit-content;
      z-index: 3;
      top: calc(100% + 5px);
      box-shadow: var(--shadow);
    }
  }

  .dots-menu {
    background-color: var(--white);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-height: 300px;
    min-width: 200px;
    overflow-y: auto;
    // .dots-menu__list
    &__list {
    }
    // .dots-menu__item
    &__item {
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
      background-color: transparent;
      padding: 10px;
      p {
        font-size: 14px;
        line-height: 20px;
        color: var(--text);
      }

      // .dots-menu__item_active
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
