<script setup lang="ts">
  import Datepicker from '@/UI/Datepicker'

  const emit = defineEmits(['selectFrom', 'selectBy'])

  defineProps({
    dateFrom: { type: String, default: '' },
    dateBy: { type: String, default: '' }
  })

  const selectFrom = (date: string) => {
    emit('selectFrom', date)
  }
  const selectBy = (date: string) => {
    emit('selectBy', date)
  }
</script>

<template>
  <div class="times">
    <div class="times__wrapper">
      <div class="times__title">Время</div>
      <div class="times__date">
        <datepicker :value="dateFrom" @selectDate="selectFrom" label="C" />
      </div>
      <div class="times__date">
        <datepicker :value="dateBy" @selectDate="selectBy" label="До" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .times {
    width: 100%;
    height: 100%;
    // .times__wrapper
    &__wrapper {
      height: 100%;
    }
    // .times__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .times__date
    &__date {
      margin-top: 19px;
    }
  }
</style>
