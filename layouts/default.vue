<script setup lang="ts">
const authStore = useAuth();

let isAuth = computed(() => {
  if (authStore.user?._id) return true;
  return false;
})
</script>
<template>
  <v-app full-height>
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
            <v-btn v-else append-icon="mdi-account-outline" to="/me">
              кабинет
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot /> <!-- This is where your page content will be rendered -->
      </v-container>
    </v-main>

    <v-footer class="d-flex justify-center align-end">
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="11" xl="10" class="d-flex">
            <v-row>
              <v-col cols="6">
                контакты и
                copyright
              </v-col>

              <v-col cols="6" class="d-flex justify-end">
                документы
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>
<style scoped lang="scss"></style>