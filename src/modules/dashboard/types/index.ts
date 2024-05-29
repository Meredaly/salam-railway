export interface TableItem {
  id: number
  numberVan: string
  lastStation: string
  currentStation: string
  statusVan: string
  date: string
  typeVan: string
  setStation: string
  act: string
  hourForPassedWay: number
  dayForRepair: number
  indexVan: string
  type: string
  description: string
  color: string
}

export interface StationsTable {
  name: string
  por: number
  gruz: number
}
