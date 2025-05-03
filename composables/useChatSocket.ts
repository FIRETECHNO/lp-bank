import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { io, Socket } from 'socket.io-client';
// Removed direct import of useFetch and FetchError if useApiFetch handles it internally
import { useRuntimeConfig /*, type FetchError */ } from '#app'; // Keep FetchError if you still need the type

// DTO для исходящего сообщения от клиента
interface SendMessageDto {
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
}

export function useChatSocket(roomId: string, initialLimit: number = 50) {
  const config = useRuntimeConfig();
  const backendUrl = config.public.apiBase; // Base URL still needed for WebSocket

  const messages = ref<ChatMessage[]>([]);
  const isConnected = ref(false);
  const isConnecting = ref(false);
  let socket: Socket | null = null;

  // --- Fetching Message History with useApiFetch ---
  const {
    data: historyData,
    pending: isLoadingHistory,
    error: historyError, // Type might implicitly come from useApiFetch or use FetchError
    execute: fetchHistory,
  } = useApiFetch<ChatMessage[]>("/messages/", {
    // Pass options needed for the fetch
    query: { // Pass query parameters here
      roomId: roomId,
      limit: initialLimit,
    },
    immediate: false, // Don't fetch immediately
    watch: false,     // We trigger manually with fetchHistory
    key: `chat-history-${roomId}`, // Unique key for caching
    method: "GET",
  });

  // Watcher remains the same
  watch(historyData, (newHistory) => {
    if (newHistory) {
      console.log(`Received ${newHistory.length} historical messages for room ${roomId}.`);
      messages.value = [...newHistory];
    }
  }, { immediate: true });


  const connect = async () => {
    if (socket || isConnecting.value) {
      console.log('Connection attempt already in progress or connected.');
      return;
    }

    console.log(`Initiating connection for room ${roomId}...`);
    isConnecting.value = true;
    isConnected.value = false;

    // 1. Fetch history first using the execute function from useApiFetch
    try {
      await fetchHistory();

      if (historyError.value) {
        console.error('Error while fetching message history:', historyError.value);
      } else {
        console.log('Message history fetch successful (or data already present).');
      }
    } catch (err) {
      console.error('Exception during fetchHistory execution:', err);
    }

    // 2. Connect WebSocket
    console.log(`Connecting WebSocket to room ${roomId}...`);
    if (socket) {
      cleanupSocketListeners();
    }
    socket = io(backendUrl, {
      forceNew: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
    setupSocketListeners();
  };

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('connect', () => {
      isConnected.value = true;
      isConnecting.value = false;
      console.log('WebSocket connected:', socket?.id);
      socket?.emit('joinRoom', roomId);
    });

    socket.on('disconnect', (reason) => {
      isConnected.value = false;
      isConnecting.value = false;
      console.log('WebSocket disconnected: ', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
      isConnected.value = false;
      isConnecting.value = false;
    });

    // socket.on('newMessage', (message: ChatMessage | SendMessageDto) => {
    //   if (message?._id && message.roomId === roomId) {
    //     console.log('New message received via WebSocket:', message);
    //     if (!messages.value.some(m => m._id === message._id)) {
    //       messages.value.push(message);
    //     } else {
    //       console.log('Duplicate message ignored:', message._id);
    //     }
    //   }
    // });

    // --- Modified newMessage Listener with Union Type and Guard ---
    socket.on('newMessage', (message: ChatMessage | SendMessageDto) => { // Explicit Union Type
      console.log('>>> newMessage event received on client:', message);

      // Basic validation: Should be handled by TS union type, but extra check is safe
      if (!message || typeof message !== 'object') {
        console.warn('Received invalid data type via WebSocket:', message);
        return;
      }

      // --- TYPE GUARD: Check for the definitive property of ChatMessage ---
      if ('_id' in message) {
        // It has an _id, so it MUST be a ChatMessage according to our types
        // No need to cast explicitly if TS understands the guard, but can add for clarity:
        const chatMsg = message as ChatMessage;

        console.log('   Received ChatMessage (has _id):', chatMsg);

        if (chatMsg.roomId === roomId) {
          console.log(`   Room ID matches. Checking for duplicates (ID: ${chatMsg._id}).`);
          const isDuplicate = messages.value.some(m => m._id === chatMsg._id);
          console.log(`   Is duplicate? ${isDuplicate}`);

          if (!isDuplicate) {
            console.log('   Adding ChatMessage to messages ref...');
            messages.value.push(chatMsg);
          } else {
            console.log('   Duplicate ChatMessage ignored:', chatMsg._id);
          }
        } else {
          console.log('   ChatMessage ignored, wrong room ID.');
        }
      }
      // --- Handle the SendMessageDto case ---
      else {
        // If it doesn't have '_id', it MUST be SendMessageDto according to the union type
        // No need to cast explicitly if TS understands the guard, but can add for clarity:
        const dtoMsg = message as SendMessageDto;

        console.warn('   Received SendMessageDto (no _id):', dtoMsg);

        // Only proceed if the room matches, otherwise ignore
        if (dtoMsg.roomId === roomId) {
          console.warn('   >> This SendMessageDto is currently being ignored as it lacks required fields (_id, createdAt, etc.) for the messages array.');
          // Decide action: Ignore (current), or implement complex optimistic update.
        } else {
          console.log('   SendMessageDto ignored, wrong room ID.');
        }
      }
    });


    socket.on('joinedRoom', (confirmationRoomId: string) => {
      console.log(`Successfully joined room: ${confirmationRoomId}`);
    });

    socket.on('error', (errorMessage: string | { message: string }) => {
      const messageText = typeof errorMessage === 'string' ? errorMessage : errorMessage.message;
      console.error('WebSocket server error:', messageText);
    });
  }

  const cleanupSocketListeners = () => {
    if (socket) {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('newMessage');
      socket.off('joinedRoom');
      socket.off('error');
    }
  }

  const disconnect = () => {
    if (socket) {
      console.log('Disconnecting WebSocket...');
      cleanupSocketListeners();
      socket.disconnect();
      socket = null;
    }
    isConnected.value = false;
    isConnecting.value = false;
  };

  const sendMessage = (content: string, senderId: string, senderName: string) => {
    if (!socket || !isConnected.value) {
      console.warn('Cannot send message: WebSocket not connected.');
      return;
    }
    if (!content.trim()) {
      console.warn('Cannot send empty message.');
      return;
    }
    const messagePayload: SendMessageDto = {
      roomId: roomId,
      content: content.trim(),
      senderId: senderId,
      senderName: senderName,
    };

    console.log('Sending message:', messagePayload);
    socket.emit('sendMessage', messagePayload, (ack: any) => {
      if (ack?.error) {
        console.error("Server error sending message:", ack.error);
      } else if (ack?.success) {
        console.log("Message sent successfully (acknowledged)");
      }
    });
  };


  // --- Lifecycle Hooks (remain the same) ---
  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  // --- Return Values (remain the same) ---
  return {
    messages,
    isConnected,
    isConnecting,
    isLoadingHistory,
    historyError,
    sendMessage,
    connect,
    disconnect,
    fetchHistory,
  };
}