import { defineStore } from "pinia"
import type { User } from "~/types/user.interface";
import MatchApi from "~/api/MatchApi";

import { ref } from "vue";

export const useMatching = defineStore('matching', () => {
  let candidates = ref<any[]>([])
  let sentRequests = ref<any[]>([]);

  async function getMatches(): Promise<User[]> {
    if (process.client) return candidates.value;

    let response = await MatchApi.getMatches();

    if (response.data.value?.length > 0) {
      for (let obj of response.data.value) {
        let candidate: User = obj;

        candidates.value.push(candidate);
      }
    }

    return candidates.value;
  }

  function getCurrentMatch(): User | null {
    console.log("Количество candidates: ", candidates.value.length);

    if (candidates.value.length > 0) {
      return candidates.value.shift();
    }
    return null;
  }

  async function processLike(likedUserId: string) {
    const userStore = useAuth();

    if (!userStore.user?._id) return;

    let response = await MatchApi.processLike(likedUserId, userStore.user?._id);

    if (response.status.value == "success") {
      return true
    }
    return false;
  }


  return {
    // variables
    candidates, sentRequests,
    // functions
    getMatches, getCurrentMatch, processLike,
  }
})