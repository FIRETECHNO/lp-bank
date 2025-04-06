import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useRuntimeConfig } from '#app';

// Интерфейс для объекта сообщения (для типа)
interface ChatMessage {
  roomId: string;
  senderId: string;
  senderName?: string; // Имя может приходить с сервера
  content: string;
  timestamp?: string; // Метка времени может приходить с сервера
  // _id?: string; // ID может приходить позже или при загрузке истории
}

const config = useRuntimeConfig()

export function useChatSocket(roomId: string) {
  const messages = ref<ChatMessage[]>([]);
  const isConnected = ref(false);
  let socket: Socket | null = null;

  // URL вашего NestJS бэкенда
  const backendUrl = config.public.apiBase;

  const connect = () => {
    if (socket) return; // Уже есть подключение

    // Подключаемся к серверу Socket.IO
    socket = io(backendUrl, {
      // Опции подключения, например, для аутентификации
      // auth: { token: 'your-jwt-token' }
    });

    socket.on('connect', () => {
      isConnected.value = true;
      console.log('WebSocket подключен:', socket?.id);
      // При подключении входим в нужную комнату
      socket?.emit('joinRoom', roomId);
    });

    socket.on('disconnect', () => {
      isConnected.value = false;
      console.log('WebSocket отключен');
    });

    socket.on('connect_error', (err) => {
      console.error('Ошибка подключения WebSocket:', err.message);
      isConnected.value = false;
    });

    // Слушаем событие 'newMessage' от сервера
    socket.on('newMessage', (message: ChatMessage) => {
      console.log('Получено новое сообщение:', message);
      // Проверяем, относится ли сообщение к текущей комнате
      if (message.roomId === roomId) {
        messages.value.push(message);
      }
    });

    // Слушаем подтверждение входа в комнату
    socket.on('joinedRoom', (msg: string) => {
      console.log('Сервер:', msg);
    });

    // Обработка ошибок от сервера
    socket.on('error', (errorMessage: string) => {
      console.error('Ошибка от сервера WebSocket:', errorMessage);
      // Здесь можно показать уведомление пользователю
    });

  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.value = false;
      messages.value = []; // Очищаем сообщения при отключении
    }
  };

  const sendMessage = (content: string) => {
    if (socket && isConnected.value && content.trim()) {
      const messagePayload = {
        roomId: roomId,
        content: content.trim(),
        // Можно добавить временный ID для отслеживания подтверждения
        // tempId: Date.now().toString()
      };
      // Отправляем событие 'sendMessage' на сервер
      socket.emit('sendMessage', messagePayload);
    } else {
      console.warn('Сокет не подключен или сообщение пустое.');
    }
  };

  // Подключаемся при монтировании компонента
  onMounted(() => {
    connect();
  });

  // Отключаемся при размонтировании
  onUnmounted(() => {
    disconnect();
  });

  return {
    messages,
    isConnected,
    sendMessage,
  };
}