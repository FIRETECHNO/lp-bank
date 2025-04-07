<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useMatching } from '~/stores/matching'; // Adjust path if needed
import type { User } from '~/types/user.interface';

const matchStore = useMatching();

// Local state for the candidate currently being displayed
const currentMatch = ref<User | null>(null);

// --- Core Logic ---

// Function to get the next candidate from the store's perspective
// Doesn't modify the store's array here
function updateCurrentMatch() {
  currentMatch.value = matchStore.getCurrentMatch(); // Gets the candidate at index 0
  console.log("Updating current match:", currentMatch.value);
}

// --- Actions Triggered by User ---

async function processLike() {
  const likedUser = currentMatch.value; // Store ref before potential async change
  if (!likedUser?._id) return;

  // Optimistically move to next? Or wait for success? Let's wait.
  try {
    const success = await matchStore.processLike(likedUser._id);
    if (success) {
      console.log("Like successful for:", likedUser.name);
      matchStore.removeCurrentMatch(); // Explicitly remove from store state
      updateCurrentMatch(); // Get the new match (or null if empty)

      // Optional: Fetch more if the list is getting low
      // if (matchStore.candidates.length < 3 && !matchStore.isLoadingMatches) {
      //   console.log("Fetching more matches proactively...");
      //   matchStore.fetchMatches(); // Fetch in background
      // }
    } else {
      console.warn("Like processed but API indicated not successful for:", likedUser.name);
      // Maybe show a transient error to the user? Toast might already be shown by plugin.
    }
  } catch (error) {
    console.error("Error during processLike in component:", error);
    // Error should have been handled globally by the plugin, but you could add component-specific feedback
  }
}

function processDislike() {
  if (!currentMatch.value) return;
  console.log("Disliking:", currentMatch.value.name);
  matchStore.removeCurrentMatch(); // Explicitly remove from store state
  updateCurrentMatch(); // Get the new match

  // Optional: Fetch more if the list is getting low
  // if (matchStore.candidates.length < 3 && !matchStore.isLoadingMatches) {
  //   console.log("Fetching more matches proactively...");
  //   matchStore.fetchMatches();
  // }
}

// --- Lifecycle & Data Loading ---

// Fetch initial matches when the component mounts if they aren't already loaded
onMounted(async () => {
  console.log("Component mounted. Checking for matches...");
  if (matchStore.candidates.length === 0 && !matchStore.isLoadingMatches) {
    console.log("No initial candidates in store, fetching...");
    // Call the store action which uses $api internally (client-side fetch)
    await matchStore.fetchMatches();
  }
  // After attempting fetch (or if data already existed), set the initial match
  updateCurrentMatch();
});

// Watch for changes in the store's candidates array (e.g., after fetchMatches completes)
// This ensures the display updates if the fetch in onMounted finishes *after* the initial updateCurrentMatch call
watch(() => matchStore.candidates, (newCandidates) => {
  console.log("Store candidates changed, updating current match if needed.");
  // Only update if the current match is now null OR the current match ID is no longer the first in the list
  if (currentMatch.value === null || (newCandidates.length > 0 && currentMatch.value?._id !== newCandidates[0]?._id)) {
    updateCurrentMatch();
  }
}, { deep: true }); // Use deep if needed, though likely not for an array of objects being replaced


// Computed property to determine if we should show the loading state
const showLoading = computed(() => {
  // Show loading if explicitly loading AND there's no match currently displayed (initial load)
  return matchStore.isLoadingMatches && currentMatch.value === null;
});

// Computed property to determine if we should show the empty state
const showEmpty = computed(() => {
  // Show empty if not loading AND there's no current match
  return !matchStore.isLoadingMatches && currentMatch.value === null && matchStore.candidates.length === 0;
});

// Computed property for error state display
const showError = computed(() => {
  // Show error if an error occurred during the last fetch AND we have no candidates to show
  return matchStore.errorLoadingMatches && currentMatch.value === null && matchStore.candidates.length === 0;
});

</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="11" xl="10">
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="8" lg="6" style="min-height: 60vh;">

            <!-- Loading State -->
            <div v-if="showLoading" class="text-center pa-5">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p class="mt-3">Ищем пользователей...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="showError" class="text-center pa-5">
              <v-icon large color="error">mdi-alert-circle-outline</v-icon>
              <p class="mt-3">Ошибка при загрузке. Пожалуйста, попробуйте позже!</p>
              <pre v-if="matchStore.errorLoadingMatches">{{ matchStore.errorLoadingMatches.message }}</pre>
              <v-btn @click="matchStore.fetchMatches" :loading="matchStore.isLoadingMatches" color="primary"
                class="mt-2">
                Загрузить
              </v-btn>
            </div>

            <!-- Candidate Card -->
            <!-- Only show card if NOT loading/error AND a match exists -->
            <CandidateCard v-else-if="currentMatch" :candidate="currentMatch" @like="processLike"
              @dislike="processDislike" />

            <!-- Empty State -->
            <div v-else-if="showEmpty" class="text-center pa-5">
              <v-icon large color="grey">mdi-account-search-outline</v-icon>
              <p class="mt-3">Нет кандидатов на сегодня</p>
              <v-btn @click="matchStore.fetchMatches" :loading="matchStore.isLoadingMatches" color="primary"
                class="mt-2">
                Поискать ещё раз
              </v-btn>
            </div>

          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>