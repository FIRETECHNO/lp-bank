import { useNuxtApp } from '#app';
import type { User } from '~/types/user.interface'; // Assuming User interface exists

export default {
  // processLike(likedUserId: string, userId: string): Promise<any> {
  //   return useApiFetch('/matching/like', { method: 'POST', body: { likedUserId, userId } })
  // },
  populateMatches(userId: string): Promise<any> {
    return useApiFetch(`/matching/populate-matches?user_id=${userId}`, { method: "GET" })
  },
  // acceptMatch(matchId: string, senderId: string, receiverId: string) {
  //   return useApiFetch('/matching/accept-match', {
  //     method: "POST",
  //     body: {
  //       matchId,
  //       senderId,
  //       receiverId
  //     }
  //   })
  // },
  async getMatches(): Promise<User[] | null> {
    const { data: users, pending, error } = await useApiFetch<User[]>('/matching/get-matches', { method: 'GET' }); // Assuming GET, adjust if POST
    return users.value;
  },

  processLike(likedUserId: string, userId: string): Promise<{ success: boolean }> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<{ success: boolean }>('/matching/like', { // Adjust endpoint if needed
      method: 'POST',
      body: { likedUserId, userId },
    });
  },

  acceptMatch(matchId: string, senderId: string, receiverId: string): Promise<void> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<void>('/matching/accept', { // Adjust endpoint if needed
      method: 'POST',
      body: { matchId, senderId, receiverId },
    });
  },
}