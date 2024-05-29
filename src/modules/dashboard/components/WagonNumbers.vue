<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { PropType } from 'vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'

  const emit = defineEmits(['checkWagonNumber', 'reset'])

  const props = defineProps({
    wagonNumbers: { type: Array as PropType<string[]>, default: () => [] },
    checkedWagonNumbers: { type: Array as PropType<string[]>, default: () => [] }
  })

  const checkItem = (item: string) => {
    emit('checkWagonNumber', item)
  }
  const searchText = ref<string>('')
  const searchedWagonNumbers = computed(() => {
    return props.wagonNumbers.filter((number: string) => number.includes(searchText.value.toString()))
  })

  const reset = () => {
    emit('reset')
  }
</script>

<template>
  <div class="wagon-numbers">
    <div class="wagon-numbers__wrapper">
      <div class="wagon-numbers__head">
        <div class="wagon-numbers__title">№ Вагон</div>
        <div class="wagon-numbers__controllers">
          <my-button @click="reset" prev-icon="reset" styles="gray" />
        </div>
      </div>
      <div class="wagon-numbers__search">
        <text-field v-model.trim="searchText" placeholder="Поиск" prev-icon="search" type="number" />
      </div>
      <div class="wagon-numbers__numbers">
        <table>
          <tbody>
            <tr v-for="wagonNumber in searchedWagonNumbers">
              <td @click="checkItem(wagonNumber)" :class="{ _active: checkedWagonNumbers.includes(wagonNumber) }">{{ wagonNumber }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .wagon-numbers {
    width: 100%;
    height: 100%;
    // .wagon-numbers__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    // .wagon-numbers__head
    &__head {
      display: flex;
      justify-content: space-between;
      padding-bottom: 6px;
    }
    // .wagon-numbers__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .wagon-numbers__controllers
    &__controllers {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    // .wagon-numbers__search
    &__search {
      padding-bottom: 14px;
    }
    // .wagon-numbers__numbers
    &__numbers {
      border-radius: 4px;
      border: 1px solid var(--shade-400);
      overflow: hidden;
      height: 0;
      flex: 1 1;
      overflow: auto;
      table {
        width: 100%;
        border-collapse: collapse;
        tbody {
          tr {
            td {
              border-top: 1px solid var(--shade-400);
              border-bottom: 1px solid var(--shade-400);
              color: var(--text);
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
              padding: 6px 10px;
              cursor: pointer;
              user-select: none;
              &:hover {
                background-color: var(--shade-400);
              }
              &._active {
                background-color: var(--primary);
                color: var(--white);
              }
            }
          }
        }
      }
    }
  }
</style>
