<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { User } from '~/types/user.interface';
import AuthApi from '~/api/AuthApi';

definePageMeta({
  layout: "student-cabinet",
  middleware: ['student']
});

const authStore = useAuth();
await authStore.getMyLessons();

const lessonsLoading = ref(true);
authStore.getMyLessons().finally(() => {
  lessonsLoading.value = false;
});

const { lessons } = storeToRefs(authStore);

const upcomingLessons = computed(() => {
  if (!lessons.value || lessons.value.length === 0) {
    return {
      nextLesson: null,
      otherLessons: []
    };
  }

  const sortedFutureLessons = lessons.value; // they're already sorted

  if (sortedFutureLessons.length === 0) {
    return {
      nextLesson: null,
      otherLessons: []
    };
  }

  const nextLesson = sortedFutureLessons[0];

  const otherLessons = sortedFutureLessons.slice(1);

  return {
    nextLesson,
    otherLessons
  };
});


const isTeacherDialogVisible = ref(false);
const isLoadingTeacher = ref(false);
const selectedTeacher = ref<User | null>(null);

async function showTeacherProfile(teacherId: string) {
  isTeacherDialogVisible.value = true;
  isLoadingTeacher.value = true;
  selectedTeacher.value = null;

  try {
    selectedTeacher.value = await AuthApi.getUserById(teacherId);
  } catch (error) {
    console.error("Ошибка при загрузке данных преподавателя:", error);
    selectedTeacher.value = null;
  } finally {
    isLoadingTeacher.value = false;
  }
}
</script>

<template>
  <div>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="11" xl="10">
        <h1 class="text-h4 mb-4">Мои уроки</h1>

        <div v-if="lessonsLoading" class="text-center pa-10">
          <v-progress-circular indeterminate size="50"></v-progress-circular>
          <p class="mt-3 text-grey">Загружаем расписание...</p>
        </div>

        <div v-else>
          <v-row v-if="upcomingLessons.nextLesson">
            <v-col cols="12">
              <h2 class="text-h5 mb-3 text-primary">Ближайший урок</h2>
              <ClientOnly>
                <LessonCardStudent :lesson="upcomingLessons.nextLesson" @view-teacher="showTeacherProfile" elevation="8"
                  variant="outlined" />
                <template #fallback>
                  <v-skeleton-loader type="card@2"></v-skeleton-loader>
                </template>
              </ClientOnly>
            </v-col>

            <v-col v-if="upcomingLessons.otherLessons.length > 0" cols="12">
              <v-divider class="my-6"></v-divider>
              <h2 class="text-h5 mb-3">Следующие уроки</h2>
            </v-col>

            <v-col v-for="(lesson, index) in upcomingLessons.otherLessons" :key="index" cols="12" md="6" lg="4">
              <ClientOnly>
                <LessonCardStudent :lesson="lesson" @view-teacher="showTeacherProfile" />
                <template #fallback>
                  <v-skeleton-loader type="card"></v-skeleton-loader>
                </template>
              </ClientOnly>
            </v-col>
          </v-row>

          <!-- Если уроков нет -->
          <v-alert v-else type="info" variant="tonal" class="my-4">
            У вас пока нет запланированных уроков. Вы можете записаться на новый!
          </v-alert>
        </div>

      </v-col>
    </v-row>

    <v-dialog v-model="isTeacherDialogVisible" max-width="500px" scrollable>
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Профиль преподавателя</span>
          <v-btn icon="mdi-close" variant="text" @click="isTeacherDialogVisible = false"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <div v-if="isLoadingTeacher" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">Загрузка данных...</p>
          </div>

          <div v-else-if="selectedTeacher">
            <UserCard :user="selectedTeacher" />
          </div>

          <div v-else>
            <v-alert type="error" variant="tonal" text="Не удалось загрузить информацию о преподавателе."></v-alert>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>