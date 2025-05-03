// --- ChatMessage Interface (ensure it matches server response) ---
interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: {
    _id: string;
    name?: string;
    username?: string;
  } | string;
  senderName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}