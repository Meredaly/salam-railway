import { request } from '@/api/generic.api'

export const GET_STATIONS = () => request({ url: '/api/v1/dataFixing/get/all', method: 'GET' })
