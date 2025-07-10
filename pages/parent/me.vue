<script setup lang="ts">
definePageMeta({
  layout: "parent-cabinet"
})

const authStore = useAuth();

let user = authStore.user;
</script>
<template>
  <v-row class="d-flex justify-center align-center">
    <v-col cols="12" md="11" xl="10">
      parent me
      {{ user }}
    </v-col>
  </v-row>
</template>