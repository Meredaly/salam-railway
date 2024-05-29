<script setup lang="ts">
  import { ref, watchEffect, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStations } from '@/store/stations'
  import { useAuth } from '@/store/auth'

  import Icon from '@/UI/Icon'

  defineProps({
    isMinimize: {
      type: Boolean,
      default: false
    }
  })

  const route = useRoute()
  const stations = useStations()
  const auth = useAuth()

  const showPages = ref<boolean>(false)

  const menuStations = computed(() => stations.getStations) as any

  const togglePages = (): void => {
    showPages.value = !showPages.value
  }

  watchEffect(() => {
    showPages.value = route.path.includes('/dashboard/pages')
  })
</script>

<template>
  <div :class="['menu', { menu_mini: isMinimize }]">
    <ul class="menu__list">
      <li class="menu__item">
        <router-link to="/dashboard" class="menu__link" active-class="">
          <icon name="home" />
          <p>Главный</p>
        </router-link>
      </li>
      <li class="menu__item">
        <a @click.prevent="togglePages" href="#" :class="['menu__link', { 'router-link-active': showPages }]">
          <icon name="pages" />
          <p>Страницы</p>
          <icon name="chevronDown" class="menu__link-arrow" />
        </a>
        <ul class="menu__sub">
          <li v-for="station in menuStations" class="menu__sub-item">
            <router-link :to="`/dashboard/pages/${station.id}`" class="menu__sub-link">{{ station.name }}</router-link>
          </li>
        </ul>
      </li>
      <li v-if="auth.getUser.role === 'ROLE_ADMIN'" class="menu__item">
        <router-link to="/accounts" class="menu__link">
          <icon name="accounts" />
          <p>Пользователи</p>
        </router-link>
      </li>
      <li class="menu__item">
        <router-link to="/documents" class="menu__link">
          <icon name="documents" />
          <p>Импортировать файл</p>
        </router-link>
      </li>
      <li class="menu__item">
        <router-link to="/history" class="menu__link">
          <icon name="history" />
          <p>История</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .menu {
    width: 100%;
    // .menu_mini
    &_mini {
      .menu__link {
        padding: 10px;
        &:deep() {
          svg {
            width: 20px;
            height: 20px;
          }
        }
        p {
          display: none;
        }
      }
      .menu__link-arrow {
        display: none;
      }
      .menu__sub {
        padding-left: 0;
      }
      .menu__sub-link {
        display: flex;
        width: max-content;
      }
    }
    // .menu__list
    &__list {
      width: 100%;
    }
    // .menu__item
    &__item {
      &:not(:first-child) {
        margin-top: 12px;
      }
    }
    // .menu__link
    &__link {
      display: flex;
      width: 100%;
      padding: 12px 20px;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
      transition: 0.2s;
      p {
        flex: 1 1;
        font-size: 14px;
        line-height: 20px;
      }
      &:hover {
        color: var(--true-white);
        background-color: var(--primary);
      }
      &.router-link-active,
      &.router-link-exact-active {
        color: var(--white);
        background-color: var(--primary);
        color: var(--true-white);
      }
    }
    .menu__link.router-link-active + .menu__sub {
      display: block;
    }
    .menu__link.router-link-active .menu__link-arrow {
      transform: rotate(180deg);
    }
    // .menu__link-arrow
    &__link-arrow {
    }

    // .menu__sub
    &__sub {
      margin-top: 10px;
      padding-left: 20px;
      display: none;
    }
    // .menu__sub-item
    &__sub-item {
      &:not(:first-child) {
        margin-top: 4px;
      }
    }
    // .menu__sub-link
    &__sub-link {
      width: 100%;
      line-height: 20px;
      padding: 4px 10px;
      display: block;
      border-radius: 4px;
      font-size: 12px;
      &:hover,
      &.router-link-exact-active {
        background-color: var(--primary);
        color: var(--true-white);
      }
    }
  }
</style>
