import { request } from '@/api/generic.api'

export const LOGIN = ({ data }: any) => request({ url: '/api/v1/login', data, method: 'POST', file: true })

export const CHECK_AUTH = () => request({ url: '/api/v1/get/user', method: 'GET' })
