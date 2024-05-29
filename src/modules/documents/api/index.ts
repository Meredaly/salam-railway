import { request } from '@/api/generic.api'

export const ADD_PW = ({ data }: any) => request({ url: '/api/v1/data/load/data/in/excel/file', data, method: 'POST', file: true })
export const ADD_ACT = ({ data }: any) => request({ url: '/api/v1/van/load/vans/in/excel/file', data, method: 'POST', file: true })
