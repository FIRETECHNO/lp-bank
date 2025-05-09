<script setup lang="ts">
let step = ref<number>(1)
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" sm="10" md="7" xl="6">
        <v-window v-model="step">
          <v-window-item :value="1" class="pa-2">
            <AboutMePersonal />
          </v-window-item>

          <v-window-item :value="2" class="pa-2">
            <AboutMePartnerFilters />
          </v-window-item>

          <v-window-item :value="3" class="pa-2">
            <div class="pa-4 text-center">
              <v-img class="mb-4" height="128" src="https://cdn.vuetifyjs.com/images/logos/v.svg"></v-img>
              <h3 class="text-h6 font-weight-light mb-2">
                Welcome to Vuetify
              </h3>
              <span class="text-caption text-grey">Thanks for signing up!</span>
            </div>
          </v-window-item>
        </v-window>
        <v-card-actions>
          <v-btn v-if="step > 1" variant="text" @click="step--">
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="step < 3" color="primary" variant="flat" @click="step++">
            Следующий шаг
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>
<style></style>