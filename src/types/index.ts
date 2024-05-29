export interface Request {
  url: string
  method: string
  headers?: any
  params?: object
  data?: object
  onUploadProgress?: any
  file?: boolean
}

export interface TableHeadItem {
  id: string
  sort: boolean
  visibility: boolean
  key: string
  title: string
}

export interface SelectCheckboxItem {
  id: string
  name: string
}
