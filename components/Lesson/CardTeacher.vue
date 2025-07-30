<script setup lang="ts">
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Lesson } from '~/types/lesson.interface';

const props = defineProps<{ lesson: Lesson }>();
const emit = defineEmits(['reschedule', 'cancel', 'viewStudent', 'viewTeacher']);

const { getSubjectsText, getGradesText, getGoalsText } = useLessonPurposeData();

const smartFormattedDateTime = computed(() => {
  if (!props.lesson.dateTime) return 'Дата не указана';

  try {
    const date = parseISO(props.lesson.dateTime);

    if (isToday(date)) {
      return format(date, "'Сегодня в' HH:mm", { locale: ru });
    }
    if (isTomorrow(date)) {
      return format(date, "'Завтра в' HH:mm", { locale: ru });
    }
    return format(date, "d MMMM yyyy 'в' HH:mm", { locale: ru });

  } catch (error) {
    console.error("Invalid date format:", props.lesson.dateTime);
    return 'Неверный формат даты';
  }
});
</script>

<template>
  <v-card class="mb-4" elevation="3" rounded="lg">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <p class="text-h6 text-primary">{{ smartFormattedDateTime }}</p>
        <p class="text-subtitle-2 text-grey-darken-1">ID Учителя: {{ lesson.teacher }}</p>
      </div>
      <v-chip v-if="lesson.isFirstLesson" color="success" variant="flat" prepend-icon="mdi-star-circle-outline"
        text="Первый урок"></v-chip>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <v-list density="compact" bg-color="transparent">
        <!-- Предметы -->
        <v-list-item class="px-0">
          <template #prepend><v-icon class="mr-3">mdi-book-open-variant</v-icon></template>
          <v-list-item-title>{{ getSubjectsText(lesson.subjects) }}</v-list-item-title>
          <v-list-item-subtitle>Предметы</v-list-item-subtitle>
        </v-list-item>

        <!-- Классы -->
        <v-list-item class="px-0">
          <template #prepend><v-icon class="mr-3">mdi-school</v-icon></template>
          <v-list-item-title>{{ getGradesText(lesson.grades) }}</v-list-item-title>
          <v-list-item-subtitle>Классы</v-list-item-subtitle>
        </v-list-item>

        <!-- Цели -->
        <v-list-item class="px-0">
          <v-tooltip location="top" activator="parent">
            <span>{{ getGoalsText(lesson.goals) }}</span>
          </v-tooltip>
          <template #prepend><v-icon class="mr-3">mdi-target</v-icon></template>
          <v-list-item-title>{{ getGoalsText(lesson.goals) }}</v-list-item-title>
          <v-list-item-subtitle>Цели</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-divider></v-divider>

    <!-- КНОПКИ ДЕЙСТВИЙ -->
    <v-card-actions class="pa-3">
      <v-btn variant="text" @click="emit('viewStudent', lesson.student)">
        Профиль ученика
      </v-btn>
      <v-spacer></v-spacer>
      <!-- <v-btn color="secondary" variant="tonal" @click="emit('reschedule', lesson._id)"
        prepend-icon="mdi-calendar-sync-outline">
        Перенести
      </v-btn>
      <v-btn color="error" variant="tonal" @click="emit('cancel', lesson._id)" prepend-icon="mdi-cancel">
        Отменить
      </v-btn> -->
    </v-card-actions>
  </v-card>
</template>