<script setup lang="ts">
  import { watchEffect } from 'vue'
  import { useCookies } from 'vue3-cookies'

  const { cookies } = useCookies()

  watchEffect(() => {
    if (cookies.get('theme') === 'dark') {
      document.querySelector('html')?.classList.add('dark-mode')
    }
  })
</script>

<template>
  <router-view />
</template>

<style scoped></style>
