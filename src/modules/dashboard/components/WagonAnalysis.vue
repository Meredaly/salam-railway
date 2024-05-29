<script setup lang="ts">
  import Icon from '@/UI/Icon'

  defineProps({
    wagonLoadAnalysis: {
      type: Object,
      default: {
        gruz: 0,
        por: 0
      }
    }
  })
</script>

<template>
  <div class="wagon-analysis">
    <div class="wagon-analysis__wrapper">
      <div class="wagon-analysis__title">Анализ загруженности вагонов</div>
      <div class="wagon-analysis__body">
        <div class="wagon-analysis__item">
          <div class="wagon-analysis__item-title">ВСЕ</div>
          <div class="wagon-analysis__count">{{ wagonLoadAnalysis.gruz + wagonLoadAnalysis.por }}</div>
          <div class="wagon-analysis__icon">
            <icon name="wagon1" />
          </div>
        </div>
        <div class="wagon-analysis__item">
          <div class="wagon-analysis__item-title">ГРУЖ</div>
          <div class="wagon-analysis__count">{{ wagonLoadAnalysis.gruz }}</div>
          <div class="wagon-analysis__icon">
            <icon name="wagon2" />
          </div>
        </div>
        <div class="wagon-analysis__item">
          <div class="wagon-analysis__item-title">ПОР</div>
          <div class="wagon-analysis__count">{{ wagonLoadAnalysis.por }}</div>
          <div class="wagon-analysis__icon">
            <icon name="wagon3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wagon-analysis {
    width: 100%;
    height: 100%;
    // .wagon-analysis__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    // .wagon-analysis__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .wagon-analysis__body
    &__body {
      flex: 1 1;
      height: 0;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 12px;
    }
    // .wagon-analysis__item
    &__item {
      background: var(--background);
      border: 1px solid var(--shade-400);
      border-radius: 4px;
      padding: 9px;
      display: flex;
      flex-wrap: wrap;
      &:first-child {
        grid-row-start: span 2;
        .wagon-analysis__count {
          font-size: 40px;
          line-height: 50px;
          margin-top: 10px;
          width: 100%;
        }
        .wagon-analysis__icon {
          justify-content: flex-start;
        }
      }
    }
    // .wagon-analysis__item-title
    &__item-title {
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      color: var(--text);
      width: 100%;
    }
    // .wagon-analysis__count
    &__count {
      font-weight: 600;
      font-size: 24px;
      line-height: 30px;
      color: var(--text);
      margin-top: 4px;
      flex: 1 1;
    }
    // .wagon-analysis__icon
    &__icon {
      margin-top: 4px;
      flex: 1 1;
      display: flex;
      align-items: end;
      justify-content: flex-end;
    }
  }
</style>
