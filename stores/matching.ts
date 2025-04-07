import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from '#app'; // Import to access injected $api
import type { User } from "~/types/user.interface";
import { useAuth } from "./auth"; // Assuming your auth store path

// Remove the direct import of MatchApi
// import MatchApi from "~/api/MatchApi";

export const useMatching = defineStore('matching', () => {
  // === State ===
  const candidates = ref<User[]>([]);
  const sentRequests = ref<any[]>([]); // Define type if possible
  const isLoadingMatches = ref(false);
  const errorLoadingMatches = ref<Error | null>(null);

  // Access the injected API service
  // Note: Can't call useNuxtApp() at the top level here, must be inside functions/actions
  // const { $api } = useNuxtApp(); // <--- DO NOT DO THIS HERE

  // === Actions ===

  /**
   * Fetches potential matches from the API and updates the candidates list.
   * This action uses $api directly, suitable for calls triggered after setup
   * (e.g., in onMounted or by user interaction).
   */
  async function fetchMatches() {
    // Get $api inside the action where it's needed
    const { $api } = useNuxtApp();
    if (isLoadingMatches.value) return; // Prevent concurrent fetches

    isLoadingMatches.value = true;
    errorLoadingMatches.value = null;
    console.log("Fetching matches..."); // Debug log

    try {
      const fetchedUsers = await $api.getMatches(); // Use the service
      candidates.value = fetchedUsers || []; // Update state
      console.log("Matches fetched:", candidates.value); // Debug log
    } catch (error: any) {
      errorLoadingMatches.value = error;
      candidates.value = []; // Clear candidates on error
      console.error("Error fetching matches:", error);
      // Your api.ts plugin's onResponseError should have handled global errors (toast/redirect)
      // You might add more specific error handling here if needed
    } finally {
      isLoadingMatches.value = false;
    }
  }

  /**
   * Sets the initial candidates, potentially from data fetched during SSR/hydration
   * using useApiFetch in a component.
   */
  function setInitialCandidates(initialData: User[] | null) {
    if (initialData) {
      candidates.value = initialData;
      console.log("Initial candidates set:", candidates.value);
    }
  }


  /**
   * Gets the next available candidate from the local list.
   */
  function getCurrentMatch(): User | null {
    console.log("Getting current match. Candidates count:", candidates.value.length);
    if (candidates.value.length > 0) {
      // Use shift() carefully - it modifies the original array
      // Consider using a computed property for the current match if you
      // don't want to remove it immediately.
      return candidates.value[0]; // Return the first without removing
      // return candidates.value.shift(); // If you intend to remove it
    }
    return null;
  }

  /**
   * Removes the first candidate from the list (e.g., after swiping).
   */
  function removeCurrentMatch() {
    if (candidates.value.length > 0) {
      candidates.value.shift();
      console.log("Removed current match. Remaining:", candidates.value.length);
    }
  }

  /**
   * Processes a 'like' action via the API.
   */
  async function processLike(likedUserId: string): Promise<boolean> {
    const { $api } = useNuxtApp();
    const authStore = useAuth(); // Use your actual auth store composable

    if (!authStore.user?._id) {
      console.warn("Cannot process like: user not logged in.");
      return false; // Or throw an error
    }

    console.log(`Processing like for ${likedUserId} by ${authStore.user._id}`);
    try {
      const response = await $api.processLike(likedUserId, authStore.user._id);
      console.log("Like response:", response);
      // You might want to check response.isMatch here and trigger another action
      return response.success; // Return success status from API
    } catch (error) {
      console.error("Error processing like:", error);
      // Global error handling from plugin applies
      return false; // Indicate failure
    }
  }

  /**
   * Accepts a match request via the API.
   */
  async function acceptMatch(matchId: string, senderId: string, receiverId: string): Promise<boolean> {
    const { $api } = useNuxtApp();
    if (!matchId || !senderId || !receiverId) {
      console.warn("Missing IDs for acceptMatch");
      return false;
    }

    console.log(`Accepting match ${matchId} between ${senderId} and ${receiverId}`);
    try {
      await $api.acceptMatch(matchId, senderId, receiverId);
      console.log("Match accepted successfully");
      // Maybe update local state (e.g., remove from a 'pending requests' list)
      return true;
    } catch (error) {
      console.error("Error accepting match:", error);
      return false;
    }
  }

  return {
    // State (Refs)
    candidates,
    sentRequests, // Don't forget to manage this state if needed
    isLoadingMatches,
    errorLoadingMatches,

    // Getters (Computed - if you prefer getters over direct state access)
    // e.g., hasCandidates: computed(() => candidates.value.length > 0),

    // Actions (Functions)
    fetchMatches,
    setInitialCandidates,
    getCurrentMatch,
    removeCurrentMatch, // Added explicit removal action
    processLike,
    acceptMatch,
  }
});