<script setup lang="ts">
  import { PropType, ref } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyButton from '@/UI/MyButton.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'

  import { Account } from '../types'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    loading: { type: Boolean, default: false },
    item: { type: Object as PropType<Account | null>, default: null }
  })

  const form = ref({
    id: 0,
    name: '',
    surname: '',
    email: '',
    password: ''
  })
  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save', form.value)
  }

  const passwordVisible = ref<boolean>(false)

  if (props.item) {
    form.value = {
      id: props.item.id,
      name: props.item.name,
      surname: props.item.surname,
      email: props.item.email,
      password: ''
    }
  }
</script>

<template>
  <pop-up-body @close="close" title="Пользователь" width="500">
    <my-row>
      <my-col cols="12">
        <text-field label="Имя" v-model.trim="form.name" />
      </my-col>
      <my-col cols="12">
        <text-field label="Фамилия" v-model.trim="form.surname" />
      </my-col>
      <my-col cols="12">
        <text-field label="Почта" v-model.trim="form.email" />
      </my-col>
      <my-col cols="12">
        <text-field
          @click:append="passwordVisible = !passwordVisible"
          v-model.trim="form.password"
          :appendIcon="passwordVisible ? 'eyeOff' : 'eye'"
          :type="passwordVisible ? 'text' : 'password'"
          label="Пароль"
          appendClickable
        />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-10">
        <my-button @click="close" :disabled="loading" title="Отмена" styles="gray" />
        <my-button @click="save" :disabled="loading" :loading="loading" title="Сохранить" />
      </div>
    </template>
  </pop-up-body>
</template>
