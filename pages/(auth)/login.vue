<script setup lang="ts">
import { useField, useForm } from 'vee-validate';

const router = useRouter()
const auth = useAuth()

const { meta, handleSubmit, handleReset } = useForm({
  validationSchema: {
    password(value: string) {
      if (value?.length >= 8) return true
      return 'нужно 8 символов'
    },
    email(value: string) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return true
      return 'неправильный формат email'
    },
  },
})

const email = useField('email')
const password = useField('password')
let show_password = ref(false)

let selectionDialog = ref(false)
let loading = ref(false)

const login = handleSubmit(async values => {
  loading.value = true

  let res = await auth.login(values.email, values.password)

  loading.value = false
  if (res?.status?.value == "success") {
    router.push(`/`)
  }
})
function openRegistration(role: string, toggle: any) {
  toggle()
  setTimeout(() =>
    router.push(`/${role}-registration`), 300)
}
</script>
<template>
  <v-container class="align-start">
    <!-- <BackButton></BackButton> -->

    <v-col cols="12" xs="12" md="6" lg="4" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column justify-center align-center text-center rounded-lg w-100 pl-6 pr-6 pt-4 pb-6">
        <div class="text-h6 font-weight-bold">Вход</div>

        <v-form @submit.prevent="login" class="d-flex mt-3 flex-column align-center justify-center w-100">
          <v-text-field label="Email" type="email" placeholder="vasya@ya.ru" v-model="email.value.value"
            :error-messages="email.errorMessage.value" variant="outlined" density="compact" class="w-100" />

          <v-text-field label="Пароль" v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password" :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value" variant="outlined" density="compact" class="w-100" />

          <v-btn type="submit" :disabled="!meta.valid" color="accent" class="mt-4">Войти</v-btn>
        </v-form>

        <div @click="selectionDialog = !selectionDialog"
          class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1 mt-4">
          регистрация
        </div>
        <!-- <div class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1">
          восстановить пароль
        </div> -->
      </v-card>
    </v-col>
    <v-dialog v-model="selectionDialog" class="" width="auto">
      <v-card title="Как вы хотите зарегистрироваться?" max-width="600">
        <v-item-group mandatory>
          <v-container>
            <v-row>
              <v-col v-for="(role, index) in [
                { key: 'parent', name: 'Родитель' },
                {
                  key: 'teacher', name: 'Репетитор'
                }]" :key="index" cols="12" md="6">
                <v-item v-slot="{ isSelected, toggle }">
                  <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center justify-center" height="150"
                    dark @click="openRegistration(role.key, toggle)">
                    <v-scroll-y-transition>
                      <div class="text-h4 flex-grow-1 text-center ma-2">
                        {{ role.name }}
                      </div>
                    </v-scroll-y-transition>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
      </v-card>

    </v-dialog>
  </v-container>
</template>

<style scoped></style>
