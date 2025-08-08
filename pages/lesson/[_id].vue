<script setup lang="ts">
const route = useRoute();
const lessonId = route.params._id as string;
const lessonStore = useLesson();

const { currentLesson } = lessonStore

definePageMeta({
  middleware: [
    "auth",
    "lesson-access"
  ],
});

const isLoading = ref(true);

onMounted(async () => {
  try {
    await lessonStore.getLessonById(lessonId);
  } catch (error) {
    console.error("Не удалось загрузить урок:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <v-container>
    <div v-if="isLoading" class="text-center pa-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-grey">Загрузка урока...</p>
    </div>

    <div v-else-if="currentLesson">
      <div v-if="currentLesson.isFinished" class="text-center pa-10">
        <v-sheet class="pa-8 bg-grey-lighten-4 rounded-lg">
          <v-icon size="64" color="success">mdi-check-circle-outline</v-icon>
          <h2 class="text-h4 mt-4">Урок завершен</h2>
          <p class="mt-2 text-grey-darken-1">Этот урок уже закончился. Вы можете найти итоги в своем личном кабинете.
          </p>
          <v-btn variant="text" prepend-icon="mdi-home" to="/" class="mt-10">домой</v-btn>
        </v-sheet>
      </div>

      <div v-else-if="!currentLesson.isStarted" class="text-center pa-10">
        <v-sheet class="pa-8 bg-grey-lighten-4 rounded-lg">
          <v-icon size="64" color="info">mdi-timer-sand</v-icon>
          <h2 class="text-h4 mt-4">Урок еще не начался</h2>
          <p class="mt-2 text-grey-darken-1">
            Он запланирован на {{ new Date(currentLesson.dateTime).toLocaleString('ru-RU') }}.
            <br>
            Пожалуйста, вернитесь на эту страницу в назначенное время.
          </p>

          <v-btn variant="text" prepend-icon="mdi-home" to="/" class="mt-10">домой</v-btn>
        </v-sheet>
      </div>

      <div v-else>
        <h1>Урок: {{ currentLesson.subjects.join(', ') }}</h1>
        <p>Дата: {{ new Date(currentLesson.dateTime).toLocaleString() }}</p>

        <v-divider class="my-4"></v-divider>

        <iframe allow="camera;microphone;fullscreen;display-capture;autoplay"
          :src="`https://edgeconf.ru/call/?lang=ru&roomId=${lessonId}`"
          style="width:100%; height:500px; border: 1px solid #ccc; border-radius: 8px;"></iframe>

        <div v-if="currentLesson.miroBoardUrl">
          <h2 class="text-h5 my-4">Интерактивная доска</h2>
          <iframe width="100%" height="600" :src="currentLesson.miroBoardUrl" frameborder="0" scrolling="no"
            allow="fullscreen; clipboard-write" style="border: 1px solid #ccc; border-radius: 8px;"></iframe>
        </div>
        <v-alert v-else type="info" variant="tonal" class="mt-4">
          К этому уроку не прикреплена интерактивная доска.
        </v-alert>
      </div>

    </div>

    <div v-else>
      <v-alert type="error" variant="tonal" text="Не удалось найти информацию об уроке."></v-alert>
    </div>
  </v-container>
</template>