<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

import type { User } from '~/types/user.interface';

let authStore = useAuth();

let tmpUser = ref<User | null>(null);

onMounted(() => {
  tmpUser.value = Object.assign({}, authStore.user)
})
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="11" xl="10">
        <v-row>
          <v-col cols="12">
            <h1>Личный кабинет</h1>
          </v-col>
          <v-col cols="6">
            <v-card v-if="tmpUser?._id" class="pa-3">
              <v-row>
                <v-col cols="12">
                  <v-avatar color="secondary">{{ tmpUser.name[0] }}</v-avatar>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="tmpUser.name" variant="outlined" label="Имя"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="tmpUser.surname" variant="outlined" label="Фамилия"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="tmpUser.email" variant="outlined" label="email"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn color="primary" variant="outlined" :disabled="authStore.Equals(tmpUser)">сохранить</v-btn>
                </v-col>
              </v-row>
            </v-card>
            <v-card v-else>
              <v-skeleton-loader class="" type="avatar, article"></v-skeleton-loader>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card v-if="tmpUser?._id" class="pa-3">
              {{ tmpUser }}
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>