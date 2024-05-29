<script setup lang="ts">
  import { ref, onMounted, PropType, watch } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import { STATIONS_COORDINATES } from '@/helpers/stations'

  const emit = defineEmits(['check'])
  const props = defineProps({
    stations: {
      type: Array as PropType<any>,
      default: () => []
    },
    selectedStations: {
      type: Object as PropType<any>,
      default: () => {}
    }
  })

  const map = ref<any>(null)
  const circles = ref<Array<any>>([])

  const removeAllCircles = () => {
    circles.value.forEach((circle) => {
      circle.remove()
    })
    circles.value = []
  }
  const clickCircle = (station: any, coordinate: any) => {
    map.value.setView([coordinate.lat, coordinate.lng], 8, {
      animate: true,
      duration: 1
    })

    emit('check', { station, type: 'ALL' })
  }

  const addCircles = () => {
    props.stations.forEach((station: any) => {
      const findCoordinates = STATIONS_COORDINATES.find((coordinate: any) => station.name === coordinate.name)
      const count = station.gruz + station.por

      if (!findCoordinates || count <= 0) {
        return
      }

      if (Object.getOwnPropertyNames(props.selectedStations).length) {
        if (!props.selectedStations[station.name]) {
          return
        }
        map.value.setView([findCoordinates.lat, findCoordinates.lng], 8, {
          animate: true,
          duration: 1
        })
      }

      const radius = count * 500
      const circle = L.circle([findCoordinates.lat, findCoordinates.lng], {
        color: '#14509d',
        fillColor: '#14509d',
        fillOpacity: 0.3,
        radius: radius
      }).addTo(map.value)
      circle.bindPopup(station.name)

      circle.on('click', () => clickCircle(station, findCoordinates))
      circles.value.push(circle)
    })
  }

  onMounted(() => {
    map.value = L.map('map').setView([39.249, 59.744], 6, {
      animate: true,
      duration: 1
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 1,
      zoom: 100
    }).addTo(map.value)

    watch(
      () => props.stations,
      () => {
        removeAllCircles()
        addCircles()
      },
      { deep: true }
    )
  })
</script>

<template>
  <div class="stations">
    <div class="stations__wrapper">
      <div class="stations__title">Карта станций</div>
      <div class="stations__map">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .stations {
    width: 100%;
    height: 100%;
    // .stations__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    // .stations__title
    &__title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: var(--text);
    }
    // .stations__diagram
    &__map {
      flex: 1 1;
      height: 0;
      z-index: 0;
      #map {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
  }
</style>
