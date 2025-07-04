<script setup lang="ts"></script>
<template>
  <v-app>
    <v-app-bar :elevation="0" class="border">
      <v-container>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="11" xl="10" class="d-flex justify-space-between align-center">
            <v-btn to="/">лого</v-btn>

            <v-spacer></v-spacer>

            <NuxtLink to="tel:89127528877">
              <v-btn prepend-icon="mdi-phone">89127528877</v-btn>
            </NuxtLink>

            <v-btn append-icon="mdi-account" to="/login">войти</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot /> <!-- This is where your page content will be rendered -->
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<style scoped lang="scss"></style>