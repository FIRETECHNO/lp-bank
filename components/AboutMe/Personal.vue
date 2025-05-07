<script setup lang="ts">
const emit = defineEmits(["next", "prev"])
</script>
<template>
  <div>
    personal info
    <v-btn @click="emit('next')">
      next
    </v-btn>
    <v-btn @click="emit('prev')">
      prev
    </v-btn>
  </div>
</template>