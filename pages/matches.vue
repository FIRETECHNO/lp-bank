<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

const userStore = useAuth();

let { user, receivedMatches, sentMatches } = storeToRefs(userStore)

await userStore.populateMatches();
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="11" xl="10">
        <v-row>
          <v-col cols="12">
            <h1>Входящие заявки</h1>
            <v-row class="mt-5" v-if="receivedMatches.length > 0">
              <v-col cols="auto" v-for="(match, index) of receivedMatches" :key="index">
                <MatchCard :match="match.sender" :status="match.status" />
              </v-col>
            </v-row>
            <div v-else>
              Пусто
            </div>
          </v-col>

          <v-col cols="12">
            <h1>Исходящие заявки</h1>
            <v-row class="mt-5" v-if="sentMatches.length > 0">
              <v-col cols="auto" v-for="(match, index) of sentMatches" :key="index">
                <MatchCard :match="match.receiver" :status="match.status" />
              </v-col>
            </v-row>
            <div v-else>
              Пусто
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>