import { ref } from 'vue'
import { SelectCheckboxItem, TableHeadItem } from '@/types'
import { useCookies } from 'vue3-cookies'

interface PropsData {
  FILTER_NAME: string
  TABLE_HEAD: TableHeadItem[]
}

export function useFilters({ FILTER_NAME, TABLE_HEAD }: PropsData) {
  const { cookies } = useCookies()

  const showFilter = ref<boolean>(false)

  const saveFilter = (selectedFilters: SelectCheckboxItem[]) => {
    TABLE_HEAD.forEach((head: TableHeadItem): void => {
      head.visibility = selectedFilters.some((selectedCheckboxItem) => selectedCheckboxItem.id === head.id)
    })
    const selectedFiltersId = selectedFilters.map((selectedFilter) => selectedFilter.id)
    cookies.set(FILTER_NAME, selectedFiltersId.join(','), 10000000000)

    closeFilter()
  }

  const filterItems = ref<SelectCheckboxItem[]>([])
  const selectedFilters = ref<SelectCheckboxItem[]>([])
  const openFilter = () => {
    filterItems.value = TABLE_HEAD.map((head: TableHeadItem): SelectCheckboxItem => {
      return {
        id: head.id,
        name: head.title
      }
    })

    selectedFilters.value = TABLE_HEAD.filter((head: TableHeadItem): boolean => head.visibility).map((head: TableHeadItem): SelectCheckboxItem => {
      return {
        id: head.id,
        name: head.title
      }
    })

    showFilter.value = true
  }

  const closeFilter = (): void => {
    showFilter.value = false
  }

  const getFilters = (): void => {
    const savedFilters = cookies.get(FILTER_NAME)?.split(',') || null
    if (savedFilters) {
      TABLE_HEAD.forEach((head: TableHeadItem): void => {
        head.visibility = savedFilters.includes(head.id)
      })
    }
  }

  return {
    getFilters,
    closeFilter,
    openFilter,
    saveFilter,
    selectedFilters,
    filterItems,
    showFilter
  }
}
