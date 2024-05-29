import { request } from '@/api/generic.api'

export const GET_HISTORY = ({ data }: any) => request({ url: '/api/v1/story', data, method: 'POST', file: true })

export const GET_LOGISTICS = () => request({ url: '/api/v1/story/get/all/logist', method: 'GET' })

export const DELETE_HISTORY = ({ data }: any) => request({ url: '/api/v1/data/remove/excel/file/by/id', data, method: 'POST', file: true })
