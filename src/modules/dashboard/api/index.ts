import { request } from '@/api/generic.api'

export const GET_DOCUMENTS = ({ data }: any) =>
  request({ url: '/api/v1/data/get/data', data, method: 'POST', file: true })

export const UPDATE_ROW = ({ data }: any) => request({ url: '/api/v1/data/update-option-data', data, method: 'POST' })
