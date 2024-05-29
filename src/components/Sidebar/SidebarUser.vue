<script setup lang="ts">
  import { useAuth } from '@/store/auth'
  import { useCookies } from 'vue3-cookies'
  import Icon from '@/UI/Icon'

  import { useDropdown } from '@/composables/dropdown'

  defineProps({
    isMinimize: {
      type: Boolean,
      default: false
    }
  })

  const { dropdownBody, dropdownMenu, showDropdown, openDropdown, closeDropdown } = useDropdown()

  const { cookies } = useCookies()
  const auth = useAuth()

  const toggleTheme = () => {
    if (cookies.get('theme') !== 'dark') {
      document.querySelector('html')?.classList.add('dark-mode')
      cookies.set('theme', 'dark')
    } else {
      document.querySelector('html')?.classList.remove('dark-mode')
      cookies.remove('theme')
    }
    closeDropdown()
  }

  const logOut = () => {
    auth.logOut()
  }
</script>

<template>
  <div :class="['sidebar-user', { 'sidebar-user_mini': isMinimize }]" ref="dropdownBody">
    <button @click="showDropdown ? closeDropdown() : openDropdown()" class="sidebar-user__button">
      <div class="sidebar-user__button-info">
        <p>{{ auth.getUser.name }}</p>
        <span>{{ auth.getUser.email }}</span>
      </div>
      <div class="sidebar-user__button-arrow">
        <icon name="chevronDown" />
      </div>
    </button>
    <div v-if="showDropdown" ref="dropdownMenu" class="sidebar-user__menu">
      <button @click="toggleTheme" class="sidebar-user__menu-item">{{ cookies.get('theme') !== 'dark' ? 'Темный режим' : 'Светлый режим' }}</button>
      <button @click="logOut" class="sidebar-user__menu-item">Выйти</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .sidebar-user {
    position: relative;
    // .sidebar-user_mini
    &_mini {
      .sidebar-user__button {
        padding: 10px;
        &:deep() {
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
      .sidebar-user__button-info {
        display: none;
      }
    }
    // .sidebar-user__button
    &__button {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      background: var(--background);
      border: 1px solid var(--shade-400);
      border-radius: 4px;
      width: 100%;
    }
    // .sidebar-user__button-info
    &__button-info {
      flex: 1 1;
      text-align: left;
      p {
        font-weight: 600;
        font-size: 16px;
        line-height: 16px;
        color: var(--text);
      }
      span {
        display: block;
        font-weight: 400;
        font-size: 16px;
        line-height: 12px;
        margin-top: 4px;
        color: var(--primary);
      }
    }
    // .sidebar-user__button-arrow
    &__button-arrow {
      transform: rotate(-90deg);
      color: var(--gray);
    }
    // .sidebar-user__menu
    &__menu {
      position: absolute;
      box-shadow: var(--shadow);
      bottom: calc(100% + 5px);
      left: 0;
      background-color: var(--white);
      width: 300px;
      border-radius: 10px;
      overflow: hidden;
    }
    // .sidebar-user__menu-item
    &__menu-item {
      display: block;
      width: 100%;
      background-color: transparent;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      text-align: left;
      padding: 10px 20px;
      color: var(--text);
      &:first-child {
        border-bottom: 1px solid var(--shade-400);
      }
      &:hover {
        background-color: var(--background);
      }
    }
  }
</style>
