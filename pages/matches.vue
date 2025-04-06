<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

const userStore = useAuth();
const matchStore = useMatching();

let { user, receivedMatches, sentMatches } = storeToRefs(userStore)

let matchToShow = ref<any>(null)

let acceptMatchDialog = ref(false);
function showMatch(match: any) {
  acceptMatchDialog.value = true;
  matchToShow.value = match;
}

function closeAcceptMatchDialog() {
  acceptMatchDialog.value = false;
  matchToShow.value = null;
}

function rejectMatch(match: any) {


  closeAcceptMatchDialog()
}
async function acceptMatch(match: any) {
  await matchStore.acceptMatch(match._id, match.sender._id, match.receiver._id);

  closeAcceptMatchDialog()
}


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
                <MatchCard :match="match.sender" :status="match.status" @click="showMatch(match)" />
              </v-col>
            </v-row>
            <div v-else>
              Пусто
            </div>

            <v-dialog v-model="acceptMatchDialog" width="auto">
              <v-card max-width="500" v-if="matchToShow">
                <v-card-text class="d-flex flex-column align-center">
                  <v-avatar color="surface-variant" size="100" style="font-size: 50px;">
                    {{ matchToShow.sender.name[0] }}
                  </v-avatar>
                  <div class="match-name">
                    {{ matchToShow.sender.name }} {{ matchToShow.sender.surname }}
                  </div>
                  {{ matchToShow }}
                </v-card-text>
                <v-card-actions class="d-flex justify-space-around">
                  <v-btn color="error" @click="rejectMatch(matchToShow)">отклонить</v-btn>
                  <v-btn color="success" variant="elevated" @click="acceptMatch(matchToShow)">
                    принять
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
<style scoped lang="scss">
.match-name {
  font-weight: 800;
  font-size: clamp(1rem, 0.6023rem + 1.1364vw, 1.5rem); // 16 -> 24
  margin-top: 20px;
}
</style>