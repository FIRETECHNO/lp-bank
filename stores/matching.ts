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
    console.log(candidates.value.length);

    if (candidates.value.length > 0) {
      return candidates.value.shift();
    }
    return null;
  }


  return {
    // variables
    candidates, sentRequests,
    // functions
    getMatches, getCurrentMatch,
  }
})