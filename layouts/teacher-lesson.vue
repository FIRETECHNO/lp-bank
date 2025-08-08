<script setup lang="ts">
import { toast } from 'vue3-toastify';

const lessonStore = useLesson();
const route = useRoute();
const lessonId = route.params._id as string;

const { currentLesson } = lessonStore;

const endDialog = ref(false);

const summaryText = ref('');
const errorText = ref('');

const isLoading = ref(false);

function openEndDialog() {
  summaryText.value = '';
  errorText.value = '';
  endDialog.value = true;
}

function closeDialog() {
  endDialog.value = false;
}

async function submitSummary() {
  if (!summaryText.value.trim()) {
    errorText.value = 'Это поле обязательно для заполнения.';
    return;
  }

  isLoading.value = true;
  errorText.value = '';

  try {
    let res = await lessonStore.finishLesson(lessonId)
    console.log(res);


    if (res.success) {
      toast.success("Урок успешно завершен!");
      closeDialog();
    }
  } catch (error) {
    console.error('Ошибка при завершении урока:', error);
    toast.error("Произошла ошибка. Попробуйте снова.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <v-container class="d-flex justify-end">
      <v-btn v-if="!currentLesson?.isFinished" color="error" variant="tonal" prepend-icon="mdi-close"
        @click="openEndDialog">
        закончить
      </v-btn>
    </v-container>


    <slot />

    <v-dialog v-model="endDialog" max-width="550px" persistent>
      <v-card rounded="lg">
        <v-card-title>
          <span class="text-h5">Завершение урока</span>
        </v-card-title>

        <v-card-text>
          <p class="mb-4 text-grey-darken-1">
            Пожалуйста, введите краткий итог или комментарий по прошедшему уроку перед его завершением.
          </p>
          <v-textarea v-model="summaryText" label="Итог урока"
            placeholder="Например: Прошли тему X, ученик отлично справился с задачей Y." variant="outlined" rows="3"
            auto-grow counter :error-messages="errorText" @input="errorText = ''"></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog" :disabled="isLoading">
            Отмена
          </v-btn>
          <v-btn color="primary" variant="flat" @click="submitSummary" :loading="isLoading">
            Завершить и сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>