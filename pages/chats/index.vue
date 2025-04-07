<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})
const chatStore = useChat();
const router = useRouter()

let { chats } = storeToRefs(chatStore)

function joinRoom(chatId: string) {
  router.push(`/chats/${chatId}`)
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
