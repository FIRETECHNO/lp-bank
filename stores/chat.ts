import { defineStore } from "pinia"

import ChatApi from "~/api/ChatApi";

import { ref } from "vue";

export const useChat = defineStore('chat', () => {
  let chats = ref<any[]>([])


  async function getUserChats() {
    const { user } = useAuth();

    if (!user?._id) return;

    let response = await ChatApi.getUserChats(user._id);

    if (response.status.value == "success") {
      chats.value = response.data.value;
    }
  }

  return {
    // variables
    chats,
    // functions
    getUserChats,
  }
})