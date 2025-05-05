<script setup lang="ts">
import { toast } from 'vue3-toastify';

definePageMeta({
  middleware: ["auth"]
})
const chatStore = useChat();
const router = useRouter()

let { chats } = storeToRefs(chatStore)

function joinRoom(chatId: string) {
  let isSelected = chatStore.selectChat(chatId);
  if (isSelected) {
    router.push(`/chats/${chatId}?chat_id=${chatId}`)
  } else {
    toast("Ошибка при входе в чат!", {
      type: "error"
    })
  }
}

await chatStore.getUserChats();
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="11" xl="10">
        <v-row>
          <v-col cols="12" v-for="(chat, index) of chats" :key="index">
            <ChatWithUser :chat="chat" @joinRoom="joinRoom" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
