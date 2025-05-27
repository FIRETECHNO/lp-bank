import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from '#app'; // Import to access injected $api
import type { UserForList } from "~/types/user-for-list.interface";
import type { User } from "~/types/user.interface";
import { useAuth } from "./auth"; // Assuming your auth store path

// Remove the direct import of MatchApi
// import MatchApi from "~/api/MatchApi";

export const useMatching = defineStore('matching', () => {
  // === State ===
  const candidates = ref<UserForList[]>([]);
  const isLoadingMatches = ref(false);
  const errorLoadingMatches = ref<Error | null>(null);

  // === Actions ===

  async function fetchMatches() {
    const { $apiFetch } = useNuxtApp();

    if (isLoadingMatches.value) return;

    isLoadingMatches.value = true;
    errorLoadingMatches.value = null;
    const { user } = useAuth();
    console.log("Fetching matches...");

    if (!user?._id) {
      isLoadingMatches.value = false;
      errorLoadingMatches.value = new Error("Вы не авторизованы");
      console.error("Error fetching matches:", "Вы не авторизованы");
    }

    try {
      let fetchedUsers: User[] | null = await $apiFetch<User[]>('/matching/get-matches', {
        method: 'POST',
        body: {
          currentUserId: user?._id,
          partnerFilters: user?.partnerFilters ?? null
        }
      })

      candidates.value = fetchedUsers.map((obj: User) => {
        let res = { ...obj, isLiked: false }
        return res;
      }) ?? [];

      console.log("Matches fetched: ", candidates.value);
    } catch (error: any) {
      errorLoadingMatches.value = error;
      console.error("Error fetching matches:", error);
    } finally {
      isLoadingMatches.value = false;
    }
  }

  function setInitialCandidates(initialData: UserForList[] | null) {
    if (initialData) {
      candidates.value = initialData;
      console.log("Initial candidates set:", candidates.value);
    }
  }

  /**
   * Удаляет кандидата из списка по ID (например, после лайка/дизлайка).
   */
  function removeCandidateById(userId: string) {
    const index = candidates.value.findIndex(c => c._id === userId);
    if (index > -1) {
      candidates.value.splice(index, 1);
      console.log(`Removed candidate ${userId}. Remaining:`, candidates.value.length);
    }
  }

  async function processLike(likedUserId: string): Promise<boolean> {
    const { $api } = useNuxtApp();
    const authStore = useAuth();

    if (!authStore.user?._id) {
      console.warn("Cannot process like: user not logged in.");
      return false;
    }

    console.log(`Processing like for ${likedUserId} by ${authStore.user._id}`);
    try {
      const response = await $api.processLike(likedUserId, authStore.user._id);
      console.log("Like response:", response);

      if (response.success) {
        for (let i = 0; i < candidates.value.length; i++) {
          if (candidates.value[i]._id == likedUserId) {
            candidates.value[i].isLiked = true;
          }
        }
      }

      return response.success;
    } catch (error) {
      console.error("Error processing like:", error);
      return false;
    }
  }

  // processDislike - если у вас есть такой API endpoint.
  // Если дизлайк - это просто удаление из списка без отправки на сервер,
  // то эту логику можно оставить только в компоненте.
  // async function processDislike(dislikedUserId: string): Promise<boolean> {
  //   const { $api } = useNuxtApp();
  //   // ... логика вызова API для дизлайка
  //   try {
  //     // await $api.processDislike(dislikedUserId, authStore.user._id);
  //     // removeCandidateById(dislikedUserId); // Опционально
  //     return true;
  //   } catch (error) {
  //     console.error("Error processing dislike:", error);
  //     return false;
  //   }
  // }

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
      return true;
    } catch (error) {
      console.error("Error accepting match:", error);
      return false;
    }
  }

  return {
    candidates,
    isLoadingMatches,
    errorLoadingMatches,
    fetchMatches,
    setInitialCandidates,
    removeCandidateById, // Новое действие
    processLike,
    // processDislike, // Если есть
    acceptMatch,
  }
});