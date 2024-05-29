<script setup lang="ts">
  import DropdownCheckbox from '@/UI/DropdownCheckbox.vue'
  import MyButton from '@/UI/MyButton.vue'

  const emit = defineEmits(['reset'])

  defineProps({
    stations: { type: Array, default: () => [] },
    destinationStations: { type: Array, default: () => [] },
    carload: { type: Array, default: () => [] },
    types: { type: Array, default: () => [] }
  })

  const reset = () => {
    emit('reset')
  }
</script>

<template>
  <div class="filters">
    <div class="filters__wrapper">
      <div class="filters__head">
        <div class="filters__title">Фильтр</div>
        <div class="filters__controllers">
          <my-button @click="reset" prev-icon="reset" styles="gray" />
        </div>
      </div>

      <div class="filters__items">
        <div class="filters__item">
          <dropdown-checkbox :items="stations" label="Станция" placeholder="Все" />
        </div>
        <div class="filters__item">
          <dropdown-checkbox :items="destinationStations" label="Станция назначении" placeholder="Все" />
        </div>
        <div class="filters__item">
          <dropdown-checkbox :items="types" label="Тип" placeholder="Все" />
        </div>
        <div class="filters__item">
          <dropdown-checkbox :items="carload" label="Загруженность вагона" placeholder="Все" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .filters {
    height: 100%;
    // .filters__wrapper
    &__wrapper {
      height: 100%;
    }
    // .filters__head
    &__head {
      display: flex;
      justify-content: space-between;
    }
    // .filters__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .filters__controllers
    &__controllers {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    // .filters__items
    &__items {
      margin-top: 9px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
    }
    // .filters__item
    &__item {
    }
  }
</style>
