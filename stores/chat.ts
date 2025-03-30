import { defineStore } from "pinia"

import { ref } from "vue";

export const useChat = defineStore('chat', () => {
  let messages = ref<any[]>([])
  let currentRoom = ref<any>(null);

  function addMessage(message: any) {
    messages.value.push(message);
  }
  function setRoom(room: any) {
    currentRoom.value = room;
  }
  function clearMessages() {
    messages.value = [];
  }

  return {
    // variables
    messages, currentRoom,
    // functions
    addMessage, setRoom, clearMessages
  }
})