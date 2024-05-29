<script setup lang="ts">
  import { watchEffect, ref } from 'vue'
  import { useCookies } from 'vue3-cookies'
  import Sidebar from '@/components/Sidebar'
  import { useStations } from '@/store/stations'
  import { useAuth } from '@/store/auth'

  const { cookies } = useCookies()
  const auth = useAuth()

  const stations = useStations()
  watchEffect(() => {
    if (auth.isAuth) {
      stations.fetchStations()
    }
  })

  watchEffect(() => {
    if (cookies.get('theme') === 'dark') {
      document.querySelector('html')?.classList.add('dark-mode')
    }
  })

  const showMiniSidebar = ref(false)

  const toggleMiniSidebar = () => {
    showMiniSidebar.value = !showMiniSidebar.value
  }
</script>
<template>
  <div v-if="auth.isAuth" class="main">
    <div class="main__wrapper">
      <div class="main__sidebar">
        <sidebar :is-minimize="showMiniSidebar" @minimize="toggleMiniSidebar" />
      </div>
      <div class="main__body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .main {
    width: 100%;
    height: 100vh;
    // .main__wrapper
    &__wrapper {
      display: flex;
      height: 100%;
    }
    // .main__sidebar
    &__sidebar {
    }
    // .main__body
    &__body {
      flex: 1 1;
      width: 0;
    }
  }
</style>
