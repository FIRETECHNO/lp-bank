<script setup lang="ts">
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Lesson } from '~/types/lesson.interface';

const props = defineProps<{
  lesson: Lesson;
}>();

const emit = defineEmits(['viewTeacher', 'reschedule', 'cancel']);

const { getSubjectsText, getGradesText, getGoalsText } = useLessonPurposeData();

const smartFormattedDateTime = computed(() => {
  if (!props.lesson.dateTime) return 'Дата не указана';
  try {
    const date = parseISO(props.lesson.dateTime);
    if (isToday(date)) return format(date, "'Сегодня в' HH:mm", { locale: ru });
    if (isTomorrow(date)) return format(date, "'Завтра в' HH:mm", { locale: ru });
    return format(date, "d MMMM yyyy 'в' HH:mm", { locale: ru });
  } catch (e) {
    return 'Неверный формат даты';
  }
});

const fullGoalsText = computed(() => getGoalsText(props.lesson.goals));
</script>

<template>
  <v-card class="d-flex flex-column" height="100%" elevation="3" rounded="lg">
    <v-card-title class="pb-2">
      <p class="text-h6 text-primary font-weight-bold">{{ smartFormattedDateTime }}</p>
    </v-card-title>

    <v-card-subtitle class="d-flex justify-space-between align-center">
      <span>Ваш преподаватель</span>
      <v-chip v-if="lesson.isFirstLesson" color="success" variant="flat" size="small"
        prepend-icon="mdi-star-circle-outline" text="Первый урок"></v-chip>
    </v-card-subtitle>

    <v-divider class="mt-2"></v-divider>

    <v-card-text class="flex-grow-1">
      <v-list density="compact" bg-color="transparent">
        <v-list-item min-height="48" class="px-0">
          <template #prepend><v-icon class="mr-3">mdi-book-open-variant</v-icon></template>
          <div>
            <div class="v-list-item-title">{{ getSubjectsText(lesson.subjects) }}</div>
            <div class="v-list-item-subtitle">Предметы</div>
          </div>
        </v-list-item>

        <v-list-item min-height="48" class="px-0">
          <template #prepend><v-icon class="mr-3">mdi-school</v-icon></template>
          <div>
            <div class="v-list-item-title">{{ getGradesText(lesson.grades) }}</div>
            <div class="v-list-item-subtitle">Классы</div>
          </div>
        </v-list-item>

        <v-list-item min-height="48" class="px-0">
          <template #prepend><v-icon class="mr-3">mdi-target</v-icon></template>
          <div>
            <v-tooltip location="top" activator="parent">
              <span>{{ fullGoalsText }}</span>
            </v-tooltip>
            <div class="v-list-item-title text-truncate">{{ fullGoalsText }}</div>
            <div class="v-list-item-subtitle">Цели</div>
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="pa-3">
      <v-btn variant="text" @click="emit('viewTeacher', lesson.teacher)">
        Профиль преподавателя
      </v-btn>
    </v-card-actions>
  </v-card>
</template>