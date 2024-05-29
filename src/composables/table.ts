import { ref } from 'vue'

export function useTableFilter() {
  const sortType = ref<boolean>(true)
  const sortKey = ref<string>('')

  const tableFilter = (key: string, sort: boolean): void => {
    if (sort) {
      sortType.value = key === sortKey.value ? !sortType.value : true
      sortKey.value = key
    }
  }

  const getValue = (item: any, key: string): string => {
    return item[key]
  }

  return {
    sortType,
    sortKey,
    tableFilter,
    getValue
  }
}
