<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

import { io } from 'socket.io-client';


import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const chatStore = useChat();
const socket = ref<any>(null);
const newMessage = ref('');
const rooms = ['Room1', 'Room2', 'Room3']; // Список комнат (чатов)

const { messages } = storeToRefs(chatStore);

const joinRoom = (room: any) => {
  if (chatStore.currentRoom) {
    socket.value.emit('leaveRoom', chatStore.currentRoom);
  }
  socket.value.emit('joinRoom', room);
  chatStore.setRoom(room);
  chatStore.clearMessages();
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    socket.value.emit('message', {
      sender: 'User', // Имя пользователя
      message: newMessage.value,
      room: chatStore.currentRoom,
    });
    newMessage.value = '';
  }
};

onMounted(() => {
  socket.value = io(config.public.apiBase); // Подключаемся к серверу WebSocket

  socket.value.on('message', (data: any) => {
    console.log("socket.value.on('message', ...)", data);

    chatStore.addMessage(data);
  });
});

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>
<template>
  <v-container>
    <div class="chat-container">
      <div class="room-selector">
        <button v-for="room in rooms" :key="room" @click="joinRoom(room)">
          {{ room }}
        </button>
      </div>

      <div class="messages">
        messages
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <strong>{{ msg.sender }}:</strong> {{ msg.message }}
        </div>
      </div>

      <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Type a message" />
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.room-selector {
  margin-bottom: 10px;
}

.messages {
  max-width: 500px;
  width: 100%;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message {
  padding: 5px;
  border-bottom: 1px solid #ccc;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}
</style>
