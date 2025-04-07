export default {
  getUserChats(userId: string): Promise<any> {
    return useApiFetch('/chat/get-user-chats', { method: 'POST', body: { userId } })
  },
}