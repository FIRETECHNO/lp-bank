<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/stores/auth'; // Adjust path if needed

definePageMeta({
  middleware: ["auth"]
});

const route = useRoute();
const router = useRouter();
const userStore = useAuth();
const roomId = computed(() => route.params.roomId as string);

const {
  messages, // This is now ref<DisplayMessage[]>
  isConnected,
  isConnecting,
  isLoadingHistory,
  historyError,
  sendMessage,
  fetchHistory,
} = useChatSocket(roomId.value);

const {
  currentChat,
  fetchChatDetails,
  isLoadingChatDetails,
} = useChat(roomId.value);

const newMessage = ref('');
const messageListElement = ref<HTMLElement | null>(null); // Ref for scrolling

const handleSend = () => {
  if (!userStore.user?._id) {
    console.error("User ID not available.");
    return;
  }
  const userName = userStore.user.name || userStore.user.email || 'Unknown User';
  sendMessage(newMessage.value, userStore.user._id, userName);
  newMessage.value = '';
};

const formatTimestamp = (timestamp?: string): string => {
  // ... (no change needed, handles string)
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleString();
  } catch (e) { return 'Invalid date'; }
};

// --- Use DisplayMessage type ---
const getSenderName = (msg: DisplayMessage): string => {
  // Access the pre-formatted senderName or derive from senderId object
  return msg.senderName || `User (${msg.senderId._id.slice(-4)})`;
};

const getChatName = computed(() => {
  if (!userStore.user?._id || isLoadingChatDetails.value) return "Загрузка...";

  if (userStore.user._id == currentChat.value?.sender._id)
    return currentChat.value?.receiver.name + " " + currentChat.value?.receiver.surname;
  return currentChat.value?.sender.name + " " + currentChat.value?.sender.surname;
})

// --- Use DisplayMessage type ---
const isMyMessage = (msg: DisplayMessage): boolean => {
  if (!userStore.user?._id) {
    return false;
  }
  // Check based on the _id within the senderId object
  return msg.senderId._id === userStore.user._id;
};

// function createTelemostLink() {
//   try {
//     useFetch("https://cloud-api.yandex.net/v1/telemost-api/conferences", {
//       "headers": {
//         "Authorization": "OAuth y0__xDv3IW6Axjx-Tcg7ZLGnxM_aPsKhAVBV_mShiJqd3U-H9BiUQ",
//         "Content-Type": "application/json"
//       },
//       "method": "POST",
//       "body": {}
//     })
//   } catch (error) {
//     console.log(error);

//   }
// }

function goToTelemost() {
  window.open("https://telemost.yandex.ru/")
}

// --- Auto Scroll ---
watch(messages, async () => {
  // Wait for the DOM to update after messages array changes
  await nextTick();
  const listEl = messageListElement.value;
  if (listEl) {
    listEl.scrollTop = listEl.scrollHeight; // Scroll to bottom
  }
}, { deep: true }); // deep watch needed as objects inside array change

fetchChatDetails()
</script>

<template>
  <div class="chat-container">
    <h1>{{ getChatName }}</h1>
    <div class="d-flex justify-center mb-2">
      <v-btn variant="tonal" prepend-icon="mdi-calendar" @click="goToTelemost">начать встречу</v-btn>
    </div>
    <!-- Status indicators -->
    <!-- <div class="status-container">
      <div v-if="isConnecting" class="status connecting">
        Статус: Подключение...
      </div>
      <div v-else-if="isConnected" class="status connected">
        Статус: Подключено
      </div>
      <div v-else-if="historyError" class="status disconnected">
        Статус: Ошибка (см. ниже)
      </div>
      <div v-else class="status disconnected">
        Статус: Отключено
      </div>
    </div> -->

    <!-- Loading / Error States -->
    <div v-if="isLoadingHistory" class="loading-indicator">
      Загрузка истории сообщений...
    </div>
    <div v-if="historyError" class="error-message">
      <p>Не удалось загрузить историю сообщений:</p>
      <!-- Make sure error display is safe -->
      <pre>{{ historyError instanceof Error ? historyError.message : JSON.stringify(historyError) }}</pre>
      <button @click="fetchHistory()">Попробовать снова</button>
    </div>

    <!-- Message List -->
    <!-- Use v-else with isLoadingHistory for clarity -->
    <div v-else class="message-list">
      <div v-if="!messages.length" class="no-messages">
        Сообщений пока нет.
      </div>
      <!-- Use the isMyMessage helper for class binding -->
      <div v-for="msg in messages" :key="msg?._id" class="message" :class="{ 'my-message': isMyMessage(msg) }">
        <!-- Use getSenderName and createdAt -->
        <strong>{{ getSenderName(msg) }}:</strong>
        <span>{{ msg.content }}</span>
        <em class="timestamp">{{ formatTimestamp(msg.createdAt) }}</em>
      </div>
    </div>

    <!-- Message Form -->
    <form @submit.prevent="handleSend" class="message-form">
      <!-- ... form elements ... -->
      <input type="text" v-model="newMessage" placeholder="Введите сообщение..."
        :disabled="!isConnected || isConnecting" aria-label="Новое сообщение" />
      <button type="submit" :disabled="!isConnected || isConnecting || !newMessage.trim()">
        Отправить
      </button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 700px;
  /* Немного шире */
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  /* Занимает почти всю высоту */
  min-height: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.4em;
}

.status-container {
  text-align: center;
  margin-bottom: 15px;
}

.status {
  padding: 6px 12px;
  border-radius: 4px;
  display: inline-block;
  /* Чтобы не занимал всю ширину */
  font-size: 0.9em;
  font-weight: 500;
}

.connecting {
  background-color: #eef;
  color: #44a;
  border: 1px solid #cce;
}

.connected {
  background-color: #e7f7ec;
  color: #1e7e34;
  border: 1px solid #c3e6cb;
}

.disconnected {
  background-color: #fbe7e9;
  color: #d9534f;
  border: 1px solid #f5c6cb;
}

.loading-indicator,
.error-message,
.no-messages {
  text-align: center;
  padding: 20px;
  color: #666;
  flex-grow: 1;
  /* Занимает место списка сообщений */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  margin: 10px;
  /* Отступы */
}

.error-message pre {
  margin-top: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-size: 0.85em;
  text-align: left;
  max-width: 100%;
  overflow-x: auto;
  /* Горизонтальная прокрутка для длинных ошибок */
}

.error-message button {
  padding: 8px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
  /* Отступ сверху */
}

.error-message button:hover {
  background-color: #0056b3;
}


.message-list {
  flex-grow: 1;
  overflow-y: auto;
  /* Включаем прокрутку */
  border: 1px solid #eee;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fdfdfd;
  border-radius: 5px;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  background-color: #f1f1f1;
  border-radius: 15px 15px 15px 0;
  /* Стиль "облачка" */
  max-width: 80%;
  /* Не занимать всю ширину */
  word-wrap: break-word;
  /* Перенос слов */
  clear: both;
  /* Для корректной работы float */
}

.message.my-message {
  background-color: #dcf8c6;
  /* Другой цвет для своих сообщений */
  border-radius: 15px 15px 0 15px;
  float: right;
  /* Свои сообщения справа */
  text-align: right;
}

.message.my-message .timestamp {
  float: left;
  /* Таймстемп слева для своих сообщений */
  margin-left: 0;
  margin-right: 10px;
}


.message strong {
  display: block;
  /* Имя на новой строке */
  margin-bottom: 3px;
  font-size: 0.9em;
  color: #555;
}

.message .timestamp {
  font-size: 0.7em;
  /* Еще меньше */
  color: #999;
  margin-top: 4px;
  display: block;
  /* На новой строке */
  clear: both;
  /* Чтобы не влиял на float */
}


.message-form {
  display: flex;
  margin-top: auto;
  /* Прижимаем форму к низу */
}

.message-form input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  /* Скругленные края */
  margin-right: 10px;
}

.message-form button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  /* Скругленные края */
  cursor: pointer;
  transition: background-color 0.2s;
}

.message-form button:hover:not(:disabled) {
  background-color: #0056b3;
}

.message-form button:disabled {
  background-color: #ced4da;
  cursor: not-allowed;
}
</style>