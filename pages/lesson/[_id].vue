<script setup lang="ts">

const route = useRoute();
const lessonId = route.params._id as string;
const lessonStore = useLesson();

const { currentLesson } = lessonStore;


definePageMeta({
  middleware: [
    "auth",
    "lesson-access"
  ]
})


const isLoading = ref(true);

try {
  await lessonStore.getLessonById(lessonId)
} catch (error) {
  console.error("Не удалось загрузить урок:", error);
} finally {
  isLoading.value = false;
}
</script>

<template>
  <v-container>
    <div v-if="isLoading">Загрузка урока...</div>

    <div v-else-if="currentLesson">
      <h1>Урок: {{ currentLesson.subjects.join(', ') }}</h1>
      <p>Дата: {{ new Date(currentLesson.dateTime).toLocaleString() }}</p>

      <v-divider class="my-4"></v-divider>

      <iframe allow="camera;microphone;fullscreen;display-capture;autoplay"
        :src="`https://edgeconf.ru/call/?lang=ru&roomId=${lessonId}`"
        style="width:100%; height:500px; border: 1px solid #ccc; border-radius: 8px;"></iframe>

      <!-- Здесь происходит встраивание доски Miro -->
      <div v-if="currentLesson.miroBoardUrl">
        <h2 class="text-h5 mb-2">Интерактивная доска</h2>
        <iframe width="100%" height="600" :src="currentLesson.miroBoardUrl" frameborder="0" scrolling="no"
          allow="fullscreen; clipboard-write" style="border: 1px solid #ccc; border-radius: 8px;"></iframe>
      </div>

      <v-alert v-else type="info" variant="tonal" class="mt-4">
        К этому уроку не прикреплена интерактивная доска.
      </v-alert>

    </div>

    <div v-else>Не удалось найти информацию об уроке.</div>
  </v-container>
</template>