<script setup lang="ts">
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'
import { useField, useForm } from 'vee-validate'

import _ from 'lodash'

const router = useRouter()
const route = useRoute()
const auth = useAuth();

let personalDataAgreement = ref<boolean>(false)

let registrationName = computed(() => {
  if (route.params?.role == "teacher") return "Регистрация Репетитора"
  if (route.params?.role == "parent") return "Регистрация Родителя"
  if (route.params?.role == "student") return "Регистрация Ученика"
})

const { meta, handleSubmit, handleReset, validate } = useForm<{
  name: string,
  surname: string,
  phone: string,
  email: string,
  password: string,
}>({
  initialValues: {
    name: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
  },
  validationSchema: {
    name(value: string) {
      if (!value || value.length === 0) return 'введите имя'
      if (value.length < 4) return 'слишком короткое имя'
      if (value.length > 22) return 'слишком длинное имя'

      return true
    },
    surname(value: string) {
      if (!value || value.length === 0) return 'введите фамилию'
      if (value.length < 4) return 'слишком короткая фамилия'
      if (value.length > 22) return 'слишком длинная фамилия'

      return true
    },
    phone(value: string) {
      if (!value || value.length === 0) return 'введите номер телефона';
      const cleaned = value.replace(/[^\d+]/g, '');
      if (!/^(\+7|8)\d{10}$/.test(cleaned)) {
        return 'неверный формат номера';
      }
      return true;
    },
    email(value: string) {
      if (!value || value.length === 0) return 'введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'неправильно ведено'

      return true
    },
    password(value: string) {
      if (!value || value.length === 0) return 'введите пароль'
      if (value.length < 8) return 'минимум 8 символов'
      if (value.length > 30) return 'слишком длинный пароль'

      return true
    },
  },
})

let name = useField<string>('name')
let surname = useField<string>('surname')
let phone = useField<string>('phone') 
let email = useField<string>('email')
let password = useField<string>('password')

let show_password = ref(false)

let isFormValid = computed(() => {
  return personalDataAgreement.value && meta.value.valid
})

let loading = ref(false)

const submit = handleSubmit(async values => {
  loading.value = true
  let mainRole = route.params?.role ?? "user";
  let success = await auth.registration(Object.assign(values, {
    roles: [mainRole],
  }))

  if (success) {
    router.push(`/${mainRole}/me`);
  }

  loading.value = false
})
</script>

<template>
  <v-row class="d-flex justify-center align-center">
    <v-col cols="12" md="11" xl="10" class="">
      <BackButton />

      <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto">
        <v-card class="d-flex flex-column 
        justify-center align-center 
        text-center w-100 pl-6 pr-6 
        pt-4 pb-6 rounded-lg">
          <div class="text-h6 font-weight-bold">
            {{ registrationName }}
          </div>

          <v-form class="mt-6 w-100" @submit="submit">
            <v-text-field label="Имя" type="name" placeholder="Иван" v-model="name.value.value"
              :error-messages="name.errors.value" variant="outlined" density="compact" class="w-100" />

            <v-text-field label="Фамилия" type="surname" placeholder="Иванов" v-model="surname.value.value"
              :error-messages="surname.errors.value" variant="outlined" density="compact" class="w-100" />

            <v-text-field label="Номер телефона" type="tel" placeholder="+7 (999) 123-45-67" v-model="phone.value.value"
              :error-messages="phone.errors.value" variant="outlined" density="compact" class="w-100 mt-1" />

            <v-text-field label="Email" type="email" placeholder="vasya@ya.ru" v-model="email.value.value"
              :error-messages="email.errors.value" variant="outlined" density="compact" class="w-100 mt-1" />

            <v-text-field label="Пароль" v-model="password.value.value"
              :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="show_password = !show_password" :type="show_password ? 'text' : 'password'"
              :error-messages="password.errorMessage.value" variant="outlined" density="compact" class="w-100 mt-1" />
            
            <v-checkbox v-model="personalDataAgreement" label="Согласие на обработку персональных данных"></v-checkbox>

            <v-btn type="submit" :disabled="!isFormValid" :loading="loading" color="accent" class="mt-6">
              Отправить
            </v-btn>
          </v-form>

          <div @click="router.push('/login')"
            class="text-subtitle-1 w-100 cursor-pointer font-weight-semibold pa-1 mt-2">
            вход
          </div>
        </v-card>
      </v-col>
    </v-col>
  </v-row>
</template>