import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { io, Socket } from 'socket.io-client';
// Removed direct import of useFetch and FetchError if useApiFetch handles it internally
import { useRuntimeConfig /*, type FetchError */ } from '#app'; // Keep FetchError if you still need the type

// --- ChatMessage Interface (ensure it matches server response) ---
interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: {
    _id: string;
    name?: string;
    username?: string;
  } | string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function useChatSocket(roomId: string, initialLimit: number = 50) {
  const config = useRuntimeConfig();
  const backendUrl = config.public.apiBase; // Base URL still needed for WebSocket

  const messages = ref<ChatMessage[]>([]);
  const isConnected = ref(false);
  const isConnecting = ref(false);
  let socket: Socket | null = null;

  // --- Fetching Message History with useApiFetch ---

  // History URL endpoint (relative path might be sufficient if $apiFetch handles base URL)
  // Check if your $apiFetch prepend the base URL automatically
  // If yes: const historyEndpoint = computed(() => `/api/messages`);
  // If no: const historyEndpoint = computed(() => `${backendUrl}/api/messages`);
  // Let's assume $apiFetch DOES handle the base URL for now:
  const historyEndpoint = computed(() => `/messages/`);


  // *** Use useApiFetch instead of useFetch ***
  const {
    data: historyData,
    pending: isLoadingHistory,
    error: historyError, // Type might implicitly come from useApiFetch or use FetchError
    execute: fetchHistory,
  } = useApiFetch<ChatMessage[]>(historyEndpoint.value, { // <-- Call useApiFetch
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
      console.log(`Received ${newHistory.length} historical messages for room ${roomId} via useApiFetch.`);
      messages.value = [...newHistory];
    }
  }, { immediate: true });


  // --- WebSocket Connection Logic (remains largely the same) ---

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
      // Construct the full URL just for logging if needed, fetch uses the endpoint/query
      const logUrl = `${backendUrl}${historyEndpoint.value}?roomId=${roomId}&limit=${initialLimit}`;
      console.log(`Fetching message history via useApiFetch from endpoint: ${historyEndpoint.value} (query: roomId=${roomId}, limit=${initialLimit}). Full URL approx: ${logUrl}`);
      await fetchHistory(); // Execute the fetch defined by useApiFetch
      if (historyError.value) {
        console.error('Error fetching message history via useApiFetch:', historyError.value);
      } else {
        console.log('Message history fetch via useApiFetch successful (or data already present).');
      }
    } catch (err) {
      console.error('Exception during fetchHistory (useApiFetch) execution:', err);
      // historyError.value = err as FetchError; // Assign if needed and type is available
    }

    // 2. Connect WebSocket (no changes here)
    console.log(`Connecting WebSocket to ${backendUrl}...`);
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

  // setupSocketListeners, cleanupSocketListeners, disconnect, sendMessage
  // remain identical to the previous version...

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
      console.log('WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
      isConnected.value = false;
      isConnecting.value = false;
    });

    socket.on('newMessage', (message: ChatMessage) => {
      if (message && message.roomId === roomId) {
        console.log('New message received via WebSocket:', message);
        if (!messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        } else {
          console.log('Duplicate message ignored:', message._id);
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

  const sendMessage = (content: string, user /* userId */: string, userName?: string) => {
    if (!socket || !isConnected.value) {
      console.warn('Cannot send message: WebSocket not connected.');
      return;
    }
    if (!content.trim()) {
      console.warn('Cannot send empty message.');
      return;
    }
    const messagePayload = {
      roomId: roomId,
      content: content.trim(),
      user: user,
      userName: userName,
      // Можно добавить временный ID для отслеживания подтверждения
      // tempId: Date.now().toString()
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