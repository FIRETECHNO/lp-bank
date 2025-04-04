export default {
  getMatches(): Promise<any> {
    return useApiFetch('/matching/', { method: 'GET' })
  },
  processLike(likedUserId: string, userId: string): Promise<any> {
    return useApiFetch('/matching/like', { method: 'POST', body: { likedUserId, userId } })
  }
}