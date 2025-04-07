<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

const route = useRoute();
const roomId = ref(route.params.roomId as string); // Получаем ID комнаты из URL

// Используем composable
const { messages, isConnected, sendMessage } = useChatSocket(roomId.value);

const newMessage = ref('');

const handleSend = () => {
  sendMessage(newMessage.value);
  newMessage.value = ''; // Очищаем поле ввода
};

// Простая функция форматирования времени
const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleTimeString();
  } catch (e) {
    return '';
  }
};
</script>

<template>
  <div class="chat-container">
    <h1>Чат комнаты: {{ roomId }}</h1>
    <div v-if="isConnected" class="status connected">Статус: Подключено</div>
    <div v-else class="status disconnected">Статус: Отключено</div>

    <div class="message-list">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <strong>{{ msg.senderName || msg.senderId }}:</strong>
        <span>{{ msg.content }}</span>
        <em class="timestamp">{{ formatTimestamp(msg.timestamp) }}</em>
      </div>
    </div>

    <form @submit.prevent="handleSend" class="message-form">
      <input type="text" v-model="newMessage" placeholder="Введите сообщение..." :disabled="!isConnected" />
      <button type="submit" :disabled="!isConnected || !newMessage.trim()">
        Отправить
      </button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 80vh;
  /* Примерная высота */
}

.status {
  text-align: center;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 3px;
}

.connected {
  background-color: #d4edda;
  color: #155724;
}

.disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.message-list {
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 10px;
}

.message {
  margin-bottom: 8px;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.message strong {
  margin-right: 5px;
}

.message .timestamp {
  font-size: 0.75em;
  color: #888;
  margin-left: 10px;
  float: right;
}

.message-form {
  display: flex;
}

.message-form input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.message-form button {
  padding: 8px 15px;
  margin-left: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}

.message-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>