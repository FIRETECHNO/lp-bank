import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useRuntimeConfig } from '#app';

// Original DTO sent by client
interface SendMessageDto {
  roomId: string;
  senderId: string; // User ID string
  senderName: string; // User name string
  content: string;
}

// Helper to generate temporary IDs
const generateTempId = (): string => `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export function useChatSocket(roomId: string, initialLimit: number = 50) {
  const config = useRuntimeConfig();
  const backendUrl = config.public.apiBase;

  // --- Use the new DisplayMessage type for the ref ---
  const messages = ref<DisplayMessage[]>([]);
  const isConnected = ref(false);
  const isConnecting = ref(false);
  let socket: Socket | null = null;

  // --- Fetch History (Raw Data) ---
  const {
    data: rawHistoryData, // Rename data to avoid conflict
    pending: isLoadingHistory,
    error: historyError,
    execute: fetchHistory,
  } = useApiFetch<ChatMessage[]>( // Expect raw ChatMessage[]
    "/messages/", {
    query: { roomId: roomId, limit: initialLimit },
    immediate: false,
    watch: false,
    key: `chat-history-raw-${roomId}`, // Consider adjusting key if needed
    method: "GET",
    // Remove the transform option here
  }
  );

  // --- Map fetched ChatMessages to DisplayMessages using computed ---
  const historyData = computed<DisplayMessage[]>(() => {
    const fetchedMessages = rawHistoryData.value;
    console.log(`Transforming ${fetchedMessages?.length ?? 0} fetched messages via computed.`);
    if (!fetchedMessages) {
      return [];
    }
    // Perform the transformation here
    return fetchedMessages.map(chatMsg => mapChatMessageToDisplayMessage(chatMsg));
  });

  // Watcher now watches the transformed DisplayMessage data
  watch(historyData, (newHistory) => {
    if (newHistory) {
      console.log(`WATCH historyData: Received ${newHistory.length} historical DisplayMessages.`);
      // Find messages that are currently pending and might be replaced by history
      const pendingIds = messages.value.filter(m => m.isPending).map(m => m.id);
      const nonPendingHistory = newHistory.filter(histMsg => !pendingIds.includes(histMsg.id)); // Avoid adding duplicates if pending msg ID matches _id somehow

      messages.value = [...nonPendingHistory]; // Replace with fetched history
      console.log(`Messages ref length after history update: ${messages.value.length}`);
    }
  }, { immediate: true }); // Keep immediate


  // --- Mapping Functions ---
  function mapChatMessageToDisplayMessage(chatMsg: ChatMessage): DisplayMessage {
    let senderObj: DisplayMessage['senderId'];
    let derivedSenderName: string = 'Unknown';

    if (typeof chatMsg.senderId === 'string') {
      // Handle case where population failed
      senderObj = { _id: chatMsg.senderId };
      derivedSenderName = `User (${chatMsg.senderId.slice(-4)})`;
    } else {
      // Assume populated object
      senderObj = chatMsg.senderId;
      derivedSenderName = chatMsg.senderId.name || chatMsg.senderId.email || `User (${chatMsg.senderId._id.slice(-4)})`;
    }

    return {
      id: chatMsg._id, // Use the real _id
      roomId: chatMsg.roomId,
      senderId: senderObj,
      senderName: derivedSenderName, // Use derived name
      content: chatMsg.content,
      createdAt: chatMsg.createdAt,
      updatedAt: chatMsg.updatedAt,
      isPending: false, // Confirmed message
    };
  }

  function mapDtoToDisplayMessage(dtoMsg: SendMessageDto, tempId: string): DisplayMessage {
    return {
      id: tempId, // Use the generated temporary ID
      roomId: dtoMsg.roomId,
      senderId: { // Create the object structure
        _id: dtoMsg.senderId,
        name: dtoMsg.senderName, // Use name from DTO
      },
      senderName: dtoMsg.senderName, // Use name from DTO
      content: dtoMsg.content,
      createdAt: new Date().toISOString(), // Use current time as placeholder
      updatedAt: undefined,
      isPending: true, // Mark as pending
    };
  }


  // --- Connect Function (No major changes needed) ---
  const connect = async () => { /* ... connect logic ... */
    if (socket || isConnecting.value) return;
    console.log(`Connecting to room ${roomId}...`);
    isConnecting.value = true;
    isConnected.value = false;

    // 1. Fetch history
    try {
      console.log('Executing fetchHistory...');
      await fetchHistory();
      console.log('fetchHistory execution finished.');
      if (historyError.value) {
        console.error('Error fetching message history:', historyError.value);
      } else {
        console.log('Message history fetch successful. Watcher handled data mapping.');
      }
    } catch (err) {
      console.error('Exception during fetchHistory execution:', err);
    }

    // 2. Connect WebSocket
    console.log(`Connecting WebSocket to ${backendUrl}...`);
    if (socket) cleanupSocketListeners();
    if (!backendUrl) {
      console.error("WebSocket Backend URL (apiBase) is not configured!");
      isConnecting.value = false;
      return;
    }
    socket = io(backendUrl, { /* ... options ... */ });
    setupSocketListeners();
  };

  // --- WebSocket Listeners ---
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

    // --- Modified newMessage Listener ---
    socket.on('newMessage', (message: ChatMessage | SendMessageDto) => {
      console.log('>>> newMessage event received on client:', message);

      if (!message || typeof message !== 'object') return;

      if (message.roomId !== roomId) {
        console.log('   Message ignored, wrong room ID.');
        return; // Ignore messages for other rooms early
      }

      // --- TYPE GUARD ---
      if ('_id' in message) {
        // --- Handle Confirmed ChatMessage ---
        const chatMsg = message as ChatMessage;
        const displayMsg = mapChatMessageToDisplayMessage(chatMsg); // Map to unified type
        console.log('   Received & Mapped ChatMessage:', displayMsg);

        // Check if a PENDING message with the same content/sender exists (simple reconciliation)
        // A more robust way would use temp IDs if server echoed them back
        const pendingIndex = messages.value.findIndex(m =>
          m.isPending &&
          m.senderId._id === displayMsg.senderId._id &&
          m.content === displayMsg.content
          // Optionally add a time check: && Math.abs(new Date(m.createdAt).getTime() - new Date(displayMsg.createdAt).getTime()) < 5000 // Within 5s
        );

        if (pendingIndex !== -1) {
          console.log(`   Found matching pending message at index ${pendingIndex}. Replacing it.`);
          // Replace the pending message with the confirmed one
          messages.value.splice(pendingIndex, 1, displayMsg);
        } else {
          // No matching pending message, check for duplicates by final ID
          const isDuplicate = messages.value.some(m => !m.isPending && m.id === displayMsg.id);
          console.log(`   Is duplicate (by final ID)? ${isDuplicate}`);
          if (!isDuplicate) {
            console.log('   Adding confirmed DisplayMessage to messages ref...');
            messages.value.push(displayMsg);
          } else {
            console.log('   Duplicate confirmed message ignored:', displayMsg.id);
          }
        }

      } else {
        // --- Handle Optimistic SendMessageDto ---
        const dtoMsg = message as SendMessageDto;
        const tempId = generateTempId(); // Generate ID for the optimistic message
        const displayMsg = mapDtoToDisplayMessage(dtoMsg, tempId); // Map to unified type
        console.log('   Received & Mapped SendMessageDto (pending):', displayMsg);

        // Add the optimistic message immediately
        console.log('   Adding pending DisplayMessage to messages ref...');
        messages.value.push(displayMsg);
      }
      console.log(`   Messages ref length after update: ${messages.value.length}`);
    });

    socket.on('joinedRoom', (confirmationRoomId: string) => { /* ... */ });
    socket.on('error', (errorMessage: string | { message: string }) => { /* ... */ });
  }

  // --- Cleanup, Disconnect, SendMessage (No changes needed in signatures) ---
  const cleanupSocketListeners = () => { /* ... */ };
  const disconnect = () => { /* ... */ };
  // SendMessage still takes the original parameters, mapping happens on receive
  const sendMessage = (content: string, senderId: string, senderName: string) => {
    if (!socket || !isConnected.value || !content.trim()) { /* ... checks ... */ return; }

    // This payload should match exactly what the server's 'sendMessage' event expects
    const messagePayload: SendMessageDto = {
      roomId: roomId,
      content: content.trim(),
      senderId: senderId,
      senderName: senderName,
    };
    console.log('Sending message via WebSocket:', messagePayload);
    socket.emit('sendMessage', messagePayload, (ack: any) => { /* ... ack handling ... */ });

    // --- OPTIONAL: Add optimistic update immediately on send ---
    // You could add the message here *as well* as waiting for the echo,
    // but it complicates reconciliation if the echo is also a DTO.
    // Generally better to wait for the echo from the server.
    // const tempId = generateTempId();
    // const optimisticDisplayMsg = mapDtoToDisplayMessage(messagePayload, tempId);
    // messages.value.push(optimisticDisplayMsg);
    // console.log('   Added optimistic message immediately on send.');
    // ------------------------------------------------------------
  };

  // --- Lifecycle Hooks ---
  onMounted(() => { connect(); });
  onUnmounted(() => { disconnect(); });

  // --- Return Values ---
  return {
    messages, // Now ref<DisplayMessage[]>
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