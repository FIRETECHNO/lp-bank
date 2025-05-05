import { useNuxtApp } from '#app';

export default {
  getUserChats(userId: string): Promise<any> {
    return useApiFetch('/chat/get-user-chats', { method: 'POST', body: { userId } })
  },
  getCurrentChat(chatId: string): Promise<any> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<any>('/chat/get-current-chat', {
      method: 'POST',
      body: { chatId },
    });
  }
}