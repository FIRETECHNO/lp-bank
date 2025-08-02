<script setup lang="ts">
definePageMeta({
  layout: "teacher-cabinet",
  middleware: ['teacher']
})

import AuthApi from '~/api/AuthApi';
import type { Lesson } from '~/types/lesson.interface';
import type { User } from '~/types/user.interface';

const authStore = useAuth();

await authStore.getMyLessons();

let { lessons } = authStore;

// Состояние для управления видимостью диалога
const isDialogVisible = ref(false);
// Состояние для отслеживания загрузки данных студента
const isLoadingStudent = ref(false);
// Здесь будут храниться данные загруженного студента
const selectedStudent = ref<User | null>(null);

// Функция, которая будет вызываться событием @viewStudent
async function showStudentProfile(studentId: string) {
  isDialogVisible.value = true;
  isLoadingStudent.value = true;
  selectedStudent.value = null;

  try {
    selectedStudent.value = await AuthApi.getUserById(studentId);
  } catch (error) {
    console.error("Ошибка при загрузке данных студента:", error);
    selectedStudent.value = null;
  } finally {
    isLoadingStudent.value = false;
  }
}

function updateLesson(lesson: Lesson | null) {
  if (!lesson) return;

  for (let l of lessons) {
    if (l._id == lesson?._id) {
      Object.assign(l, lesson)
      return;
    }
  }
}
</script>
<template>
  <div>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="11" xl="10">
        <v-row>
          <v-col cols="12">
            <v-btn to="/add-lesson">добавить урок</v-btn>
          </v-col>

          <v-col cols="4" v-for="(lesson, index) of lessons" :key="index">
            <LessonCardTeacher @view-student="showStudentProfile" @lesson-updated="updateLesson" :lesson="lesson" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <v-dialog v-model="isDialogVisible" max-width="500px" scrollable>
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Профиль ученика</span>
          <v-btn icon="mdi-close" variant="text" @click="isDialogVisible = false"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <div v-if="isLoadingStudent" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">Загрузка данных...</p>
          </div>

          <div v-else-if="selectedStudent">
            <UserCard :user="selectedStudent" />
          </div>

          <div v-else>
            <v-alert type="error" variant="tonal" text="Не удалось загрузить информацию о пользователе."></v-alert>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>