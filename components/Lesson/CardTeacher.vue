<script setup lang="ts">
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Lesson } from '~/types/lesson.interface';

const props = defineProps<{ lesson: Lesson }>();
const emit = defineEmits(['reschedule', 'cancel', 'viewStudent', 'viewTeacher', 'lessonUpdated']);

const teacherStore = useTeacher();

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

const isMiroDialogVisible = ref(false);
const miroUrlInput = ref('');
const isSavingMiroUrl = ref(false);
const miroError = ref('');

// Функция для открытия диалога
function openMiroDialog() {
  // Заполняем поле ввода текущей ссылкой, если она есть
  miroUrlInput.value = props.lesson.miroBoardUrl || '';
  miroError.value = ''; // Сбрасываем ошибку
  isMiroDialogVisible.value = true;
}

async function saveMiroUrl() {
  if (!props.lesson?._id) return;
  if (!miroUrlInput.value) {
    miroError.value = 'Пожалуйста, вставьте ссылку на доску Miro.';
    return;
  }
  if (!miroUrlInput.value.startsWith('https://miro.com/app/live-embed/')) {
    miroError.value = 'Это не похоже на валидную ссылку на доску Miro.';
    return;
  }

  isSavingMiroUrl.value = true;
  miroError.value = '';

  try {
    const updatedLesson = await teacherStore.attachMiroBoard(props.lesson._id, miroUrlInput.value);
    emit('lessonUpdated', updatedLesson);
    isMiroDialogVisible.value = false; // Закрываем диалог
  } catch (error) {
    console.error('Ошибка при сохранении ссылки Miro:', error);
    miroError.value = 'Не удалось сохранить ссылку. Попробуйте снова.';
  } finally {
    isSavingMiroUrl.value = false;
  }
}
</script>

<template>
  <div>

    <v-card class="mb-4" elevation="3" rounded="lg">
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <p class="text-h6 text-primary">{{ smartFormattedDateTime }}</p>
          <v-chip v-if="lesson.isFirstLesson" color="success" variant="flat" prepend-icon="mdi-star-circle-outline"
            text="Первый урок"></v-chip>
        </div>
        <v-btn variant="text" @click="emit('viewStudent', lesson.student)">
          Профиль ученика
        </v-btn>
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
        <v-btn :color="lesson.miroBoardUrl ? 'success' : 'primary'" variant="flat" @click="openMiroDialog"
          :prepend-icon="lesson.miroBoardUrl ? 'mdi-check-circle' : 'mdi-plus-circle'">
          Доска Miro
        </v-btn>
        <v-spacer></v-spacer>

      </v-card-actions>
    </v-card>
    <v-dialog v-model="isMiroDialogVisible" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Прикрепить доску Miro к уроку</span>
        </v-card-title>
        <v-card-text>
          <p class="mb-2">
            Вставьте ссылку для встраивания (embed) вашей доски Miro.
            <br>
            <a href="https://help.miro.com/hc/en-us/articles/360017730993-Embedding-Boards-into-Websites"
              target="_blank" style="text-decoration: underline;">
              Как получить ссылку?
            </a>
          </p>
          <v-text-field v-model="miroUrlInput" label="Ссылка на доску Miro"
            placeholder="https://miro.com/app/live-embed/..." variant="outlined" density="compact"
            :error-messages="miroError" @input="miroError = ''"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="isMiroDialogVisible = false" :disabled="isSavingMiroUrl">
            Отмена
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveMiroUrl" :loading="isSavingMiroUrl">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>