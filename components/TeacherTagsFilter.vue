<script setup lang="ts">
import { ref, watch } from 'vue';
import type { EducationForm } from '~/types/education-form.interface';


const emit = defineEmits(['submit']);

const stepperItems = ref(['Предметы', 'Классы', 'Цели', 'Сгенерировать']);

const { selectionOptions } = useLessonPurposeData();

const formData = ref<EducationForm>({
  subjects: [],
  grades: [],
  goals: [],
});

const currentStep = ref<number>(1);

function submit() {
  emit("submit", formData.value);
}

watch(currentStep, (newStep) => {
  if (newStep == 4) {
    submit();
  }
});
</script>

<template>
  <ClientOnly>
    <v-stepper v-model="currentStep" :items="stepperItems" next-text="далее" prev-text="назад" mobile
      :max-width="currentStep == 4 ? 300 : ''">

      <template v-slot:item.1>
        <v-sheet class="pa-4">
          <p class="text-2xl font-medium mb-4">Выберите предмет(ы)</p>

          <v-chip-group v-model="formData.subjects" selected-class="text-primary" column multiple>
            <v-chip v-for="tag in selectionOptions.subjects" :key="tag.value" :value="tag.value" :text="tag.display"
              density="comfortable" class="ma-1"></v-chip>
          </v-chip-group>
        </v-sheet>
      </template>

      <template v-slot:item.2>
        <v-sheet class="pa-4">
          <p class="text-2xl font-medium mb-4">Укажите класс(ы)</p>
          <v-chip-group v-model="formData.grades" selected-class="text-primary" column multiple>
            <v-chip v-for="tag in selectionOptions.grades" :key="tag.value" :value="tag.value" :text="tag.display"
              density="comfortable" class="ma-1"></v-chip>
          </v-chip-group>
        </v-sheet>
      </template>

      <template v-slot:item.3>
        <v-sheet class="pa-4">
          <p class="text-2xl font-medium mb-4">Какая у вас цель?</p>
          <v-chip-group v-model="formData.goals" selected-class="text-primary" column multiple>
            <v-chip v-for="tag in selectionOptions.goals" :key="tag.value" :value="tag.value" :text="tag.display"
              density="comfortable" class="ma-1"></v-chip>
          </v-chip-group>
        </v-sheet>
      </template>

      <template v-slot:item.4>
        <v-sheet class="pa-4 text-center">
          <p class="text-2xl font-medium mb-4">Все готово!</p>
        </v-sheet>
      </template>

    </v-stepper>
  </ClientOnly>
</template>