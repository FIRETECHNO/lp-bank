export default {
  getMatches(): Promise<any> {
    return useApiFetch('/matching/', { method: 'GET' })
  },
  processLike(likedUserId: string, userId: string): Promise<any> {
    return useApiFetch('/matching/like', { method: 'POST', body: { likedUserId, userId } })
  },
  populateMatches(userId: string): Promise<any> {
    return useApiFetch(`/matching/populate-matches?user_id=${userId}`, { method: "GET" })
  },
  acceptMatch(matchId: string, senderId: string, receiverId: string) {
    return useApiFetch('/matching/accept-match', {
      method: "POST",
      body: {
        matchId,
        senderId,
        receiverId
      }
    })
  },
}