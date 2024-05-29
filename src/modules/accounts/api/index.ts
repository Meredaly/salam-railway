import { request } from '@/api/generic.api'

export const GET_USERS = () => request({ url: '/api/v1/admin/get/all/user', method: 'GET' })

export const ADD_USER = ({ data }: any) => request({ url: '/api/v1/admin/add/new/logist', data, method: 'POST', file: true })

export const EDIT_USER = ({ data }: any) => request({ url: '/api/v1/admin/edit/profile', data, method: 'POST', file: true })

export const DELETE_USER = ({ data }: any) => request({ url: '/api/v1/admin/remove/logist/by/id', data, method: 'POST', file: true })
