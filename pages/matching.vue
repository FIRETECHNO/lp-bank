<script setup lang="ts">
import type { User } from '~/types/user.interface';

const matchStore = useMatching();

let currentMatch = ref<User | null>();

function nextMatch() {
  currentMatch.value = matchStore.getCurrentMatch();
}

async function processLike() {
  if (!currentMatch.value?._id) return;

  let response = await matchStore.processLike(currentMatch.value?._id);
  nextMatch()
}

function processDislike() {
  nextMatch()
}

onMounted(async () => {
  await matchStore.getMatches();
  nextMatch()
})
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="11" xl="10">
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="8" lg="6" style="min-height: 60vh;">
            <CandidateCard :candidate="currentMatch" @like="processLike" @dislike="processDislike" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>