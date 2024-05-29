import { defineStore } from 'pinia'
import { GET_STATIONS } from '@/api/stations.api'

export const useStations = defineStore({
  id: 'stations',
  state: () => ({
    stations: []
  }),
  getters: {
    getStations: (state) => state.stations
  },
  actions: {
    async fetchStations() {
      try {
        this.stations = await GET_STATIONS()
      } catch (error) {
        console.error(error)
      }
    }
  }
})
