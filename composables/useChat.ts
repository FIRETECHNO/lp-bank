import ChatApi from "~/api/ChatApi";

export function useChat(roomId?: string) {
  let chats = ref<any[]>([])

  const currentChat = ref<ChatDetails | null>(null);

  const {
    data: fetchedChatData,
    pending: isLoadingChatDetails,
    error: chatDetailsError,
    execute: fetchChatDetails,
  } = useApiFetch<ChatDetails>(
    `/chat/get-by-id`,
    {
      body: {
        chatId: roomId
      },
      immediate: false,
      watch: false,
      key: `chat-details-${roomId}`,
      method: "POST",
    }
  );

  watch(fetchedChatData, (newChatDetails) => {
    if (newChatDetails) {
      console.log(`Chat details fetched for room ${roomId}:`, newChatDetails);
      currentChat.value = newChatDetails;
    }
  });


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
    currentChat,
    isLoadingChatDetails,
    // functions
    getUserChats,
    fetchChatDetails,

  }
}