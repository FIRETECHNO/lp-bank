<script setup lang="ts">
let { chat } = defineProps<{
  chat: any
}>()

const emit = defineEmits(["joinRoom"])

let currentUser = () => {
  if (chat.receiver != null) return chat.receiver;
  return chat.sender;
}

</script>
<template>
  <div @click="emit('joinRoom', chat?._id)" class="cursor-pointer">
    <v-avatar color="surface-variant">{{ currentUser().name[0] }}</v-avatar>
    {{ currentUser().name }}
    {{ currentUser().surname }}
  </div>
</template>