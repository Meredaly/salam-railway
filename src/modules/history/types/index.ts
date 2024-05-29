export interface History {
  id: number
  name: string
  importt: string
  export: null
  instruction: null
  dispatch: null
  userId: number
  logistName: string
  logistSurname: string
  idDataFixing: number | null
  status: boolean
  created: number
}

export interface Logistician {
  id: number
  name: string
  surname: string
  email: string
  password: null
  imagePath: string
  roles: string[]
  checked: boolean
}
