<script setup lang="ts">
const emit = defineEmits(["next", "prev"])
</script>
<template>
  <div>
    <!-- уровень -->
    <!-- пол -->

    <!-- возраст -->
    <v-range-slider :min="18" :max="80" step="5" thumb-label="always"></v-range-slider>
    <v-btn @click="emit('next')">
      next
    </v-btn>
    <v-btn @click="emit('prev')">
      prev
    </v-btn>
  </div>
</template>