<script setup lang="ts">
  import Icon from '@/UI/Icon'
  import SidebarMenu from './SidebarMenu.vue'
  import SidebarUser from './SidebarUser.vue'

  const emit = defineEmits(['minimize'])
  defineProps({
    isMinimize: {
      type: Boolean,
      default: false
    }
  })

  const toggleButton = () => {
    emit('minimize')
  }
</script>

<template>
  <div :class="['sidebar', { sidebar_mini: isMinimize }]">
    <button @click="toggleButton" class="sidebar__button">
      <icon name="arrowDown" />
    </button>
    <div class="sidebar__wrapper">
      <router-link to="/" class="sidebar__logo">
        <icon name="logo" />
      </router-link>
      <div class="sidebar__menu">
        <sidebar-menu :isMinimize="isMinimize" />
      </div>
      <div class="sidebar__user">
        <sidebar-user :isMinimize="isMinimize" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .sidebar {
    height: 100%;
    width: 260px;
    background-color: var(--white);
    position: relative;
    // .sidebar_mini
    &_mini {
      width: 60px;
      .sidebar__wrapper {
        padding: 10px;
      }
      .sidebar__logo {
        &:deep() {
          svg {
            width: 100%;
          }
        }
      }
    }
    // .sidebar__button
    &__button {
      position: absolute;
      right: -15px;
      top: 40px;
      transform: rotate(90deg);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background-color: var(--background);
      border: 1px solid var(--shade-400);
    }
    // .sidebar__wrapper
    &__wrapper {
      padding: 20px;
      height: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column;
      &::-webkit-scrollbar {
        width: 0px;
      }
    }

    // .sidebar__logo
    &__logo {
      color: var(--logo-color);
      display: flex;
      justify-content: center;
    }
    // .sidebar__menu
    &__menu {
      margin-top: 100px;
      flex: 1 1;
    }

    // .sidebar__user
    &__user {
      margin-top: 20px;
    }
  }
</style>
