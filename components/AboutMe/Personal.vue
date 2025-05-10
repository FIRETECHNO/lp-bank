<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import type { VForm } from 'vuetify/components';

const emit = defineEmits(['update:formData']);
const formRef = ref<VForm | null>(null);

const form = reactive({
  gender: "",
  langLevel: null as LangLevel | null,
  age: undefined as number | undefined,
  idealPartnerDescription: ""
});

const langLevels: LangLevel[] = [
  { name: 'Начальный', description: 'Могу говорить на бытовые темы', filterKey: "beginner" },
  { name: 'Средний', description: 'Могу говорить на бытовые и профессиональные темы', filterKey: "intermediate" },
  { name: 'Высокий', description: 'Могу говорить практически на любые темы', filterKey: "high" },
];

function langLevelItemProps(item: LangLevel) {
  return {
    title: item.name,
    subtitle: item.description,
  };
}

const rules = {
  required: (value: any) => !!value || 'Это поле обязательно для заполнения.',
  age: (value: number | undefined) => (value === undefined || (value >= 10 && value <= 100)) || 'Возраст должен быть от 10 до 100.',
};

watch(form, (newVal) => {
  emit('update:formData', { ...newVal });
}, { deep: true });

async function validate() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    return valid;
  }
  return false;
}

defineExpose({ validate });
</script>

<template>
  <v-form ref="formRef">
    <v-card class="d-flex flex-column pa-4">
      <v-row>
        <v-col cols="12">
          <h1>Личная информация</h1>
        </v-col>
        <v-col cols="12">
          <v-radio-group inline v-model="form.gender" :rules="[rules.required]">
            <v-radio label="Мужчина" value="male"></v-radio>
            <v-radio label="Женщина" value="female"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6">
          <v-select v-model="form.langLevel" :item-props="langLevelItemProps" :items="langLevels" item-title="name"
            return-object label="Уровень иврита" variant="outlined" :rules="[rules.required]"></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model.number="form.age" :max="100" :min="10" label="Ваш возраст" type="number"
            variant="outlined" :rules="[rules.required, rules.age]"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="form.idealPartnerDescription" label="Опишите идеального партнера (необязательно)"
            variant="outlined"></v-textarea>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>