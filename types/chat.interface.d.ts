// --- ChatMessage Interface (ensure it matches server response) ---
interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: {
    _id: string;
    name?: string;
    email?: string;
  } | string;
  senderName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DisplayMessage {
  id: string; // Use _id if available, otherwise a temporary client ID
  roomId: string;
  senderId: { // Always represent as an object for consistency in template
    _id: string;
    name?: string;
    email?: string;
  };
  content: string;
  createdAt: string; // Will be actual date for confirmed, generated date for pending
  updatedAt?: string; // Optional for pending messages
  isPending: boolean; // Flag to indicate optimistic update
  // Add senderName directly if needed for consistency, populated from DTO or ChatMessage.senderId
  senderName: string;
}