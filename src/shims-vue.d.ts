declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
declare module 'leaflet' {
  import L from 'leaflet'
  export default L
}
