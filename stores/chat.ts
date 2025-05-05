import { defineStore } from "pinia"

import ChatApi from "~/api/ChatApi";

import { ref } from "vue";

export const useChat = defineStore('chat', () => {
  let chats = ref<any[]>([])
  let currentChat = ref<any | null>(null)

  async function getUserChats() {
    const { user } = useAuth();

    if (!user?._id) return;

    let response = await ChatApi.getUserChats(user._id);

    if (response.status.value == "success") {
      chats.value = response.data.value;
    }
  }

  function selectChat(chatId: string): boolean {
    for (let chat of chats.value) {
      if (chat._id == chatId) {
        currentChat.value = chat;
        return true;
      }
    }
    return false;
  }

  async function getCurrentChat(chatId: string) {
    if (currentChat.value != null) return currentChat.value;

    let res: any = await ChatApi.getCurrentChat(chatId);

    currentChat.value = res;

    return currentChat.value;
  }

  return {
    // variables
    chats,
    // functions
    getUserChats,
    selectChat,
    getCurrentChat,
  }
})