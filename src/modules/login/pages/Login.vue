<script setup lang="ts">
  import { ref } from 'vue'
  import { useCookies } from 'vue3-cookies'
  import { useRouter } from 'vue-router'

  import Icon from '@/UI/Icon'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'

  import { LOGIN } from '@/api/auth.api'

  const { cookies } = useCookies()
  const router = useRouter()

  const form = ref({
    email: '',
    password: ''
  })

  cookies.remove('Authorization')

  const error = ref<boolean>(false)
  const loading = ref<boolean>(false)

  const login = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = false
      const { access_token } = await LOGIN({
        data: form.value
      })

      cookies.set('Authorization', access_token, 100000000)

      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      loading.value = false
      error.value = true
    }
  }

  const showPassword = ref<boolean>(false)
</script>

<template>
  <div class="login">
    <div class="login__wrapper">
      <form @submit.prevent="login" class="login__form">
        <div class="login__head">
          <div class="login__logo">
            <icon name="logo" />
          </div>
          <div class="login__name">Железнодорожный</div>
        </div>
        <div class="login__item">
          <text-field v-model.trim="form.email" :disabled="loading" :error="error" label="Логин" />
        </div>
        <div class="login__item">
          <text-field
            v-model.trim="form.password"
            :disabled="loading"
            :append-icon="showPassword ? 'eye' : 'eyeOff'"
            @click:append="showPassword = !showPassword"
            label="Пароль"
            :type="showPassword ? 'text' : 'password'"
            :error="error"
            appendClickable
          />
        </div>
        <div class="login__item">
          <my-button title="Войти" :disabled="loading" :loading="loading" block type="submit" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login {
    width: 100%;
    height: 100%;
    // .login__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // .login__form
    &__form {
      width: 500px;
      background-color: var(--white);
      padding: 24px;
      border-radius: 10px;
    }
    // .login__head
    &__head {
      display: flex;
      align-items: center;
    }
    // .login__logo
    &__logo {
      color: var(--logo-color);
    }
    // .login__name
    &__name {
      font-size: 20px;
      text-transform: uppercase;
      font-weight: 600;
      text-align: center;
      flex: 1 1;
      width: 0;
    }
    .login__logo + .login__name {
      padding-left: 10px;
      text-align: end;
    }
    // .login__item
    &__item {
      margin-top: 20px;
    }
  }
</style>
