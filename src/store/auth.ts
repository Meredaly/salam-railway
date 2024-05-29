import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'
import { CHECK_AUTH } from '@/api/auth.api'
import router from '@/router'

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    auth: false,
    user: null
  }),
  getters: {
    isAuth(): boolean {
      return this.auth
    },
    getUser(): any {
      return this.user
    }
  },
  actions: {
    async getProfile() {
      const { cookies } = useCookies()
      if (!cookies.get('Authorization')) {
        router.push('/login')
      }
      try {
        const data = await CHECK_AUTH()
        this.auth = true
        this.user = {
          ...data,
          role: data.roles[0]
        }
      } catch (error) {
        console.error(error)
        router.push('/login')
      }
    },
    logOut() {
      this.user = null
      this.auth = false
      const { cookies } = useCookies()
      cookies.remove('Authorization')
      router.push('/login')
    }
  }
})
