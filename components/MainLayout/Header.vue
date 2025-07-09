<script setup lang="ts">
const authStore = useAuth();

let isAuth = computed(() => {
  if (authStore.user?._id) return true;
  return false;
})
let cabinetRoute = computed<string>(() => {
  return `/${authStore?.role}/me`
})
</script>
<template>
  <v-app-bar :elevation="0" class="border">
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="11" xl="10" class="d-flex justify-space-between align-center">
          <v-btn to="/">лого</v-btn>

          <v-spacer></v-spacer>

          <NuxtLink to="tel:89127528877">
            <v-btn prepend-icon="mdi-phone">89127528877</v-btn>
          </NuxtLink>

          <v-btn v-if="!isAuth" append-icon="mdi-login" to="/login">войти</v-btn>
          <v-btn v-else append-icon="mdi-account-outline" :to="cabinetRoute">
            кабинет
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>