<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { VForm } from 'vuetify/components';

const emit = defineEmits(['update:formData']);
const props = defineProps<{
  initData?: any
}>()
const formRef = ref<VForm | null>(null);

const form = reactive({
  langLevel: [] as LangLevel[],
  minAge: 15,
  maxAge: 90,
  gender: "any",
});

const ageRange = ref([form.minAge, form.maxAge]);

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
  requiredSelect: (value: LangLevel[]) => value.length > 0 || 'Выберите хотя бы один уровень.',
};

watch(ageRange, (newValue) => {
  form.minAge = newValue[0];
  form.maxAge = newValue[1];
}, { deep: true });

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

if (props.initData) {
  // langLevel
  // minAge
  // maxAge
  // gender
  const data = props.initData;
  if (data?.langLevel) {
    form.langLevel = data.langLevel
  }
  if (data?.minAge) {
    form.minAge = data.minAge
  }
  if (data?.maxAge) {
    form.maxAge = data.maxAge
  }
  if (data?.gender) {
    form.gender = data.gender
  }
}

defineExpose({ validate });
</script>

<template>
  <v-form ref="formRef">
    <v-card class="d-flex flex-column pa-4">
      <v-row>
        <v-col cols="12">
          <h1>Каких партнеров вам показывать?</h1>
        </v-col>
        <v-col cols="12">
          <v-select v-model="form.langLevel" :item-props="langLevelItemProps" :items="langLevels" item-title="name"
            return-object label="Уровень иврита" variant="outlined" multiple chips
            :rules="[rules.requiredSelect]"></v-select>
        </v-col>
        <v-col cols="12">
          Возраст от, до
          <v-range-slider v-model="ageRange" :max="90" :min="15" :step="1" class="align-center" hide-details>
            <template v-slot:prepend>
              <v-text-field :model-value="ageRange[0]"
                @update:model-value="val => ageRange = [Number(val), ageRange[1]]" density="compact" style="width: 70px"
                type="number" variant="outlined" hide-details single-line></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field :model-value="ageRange[1]"
                @update:model-value="val => ageRange = [ageRange[0], Number(val)]" density="compact" style="width: 70px"
                type="number" variant="outlined" hide-details single-line></v-text-field>
            </template>
          </v-range-slider>
        </v-col>
        <v-col cols="12">
          <v-radio-group inline v-model="form.gender">
            <v-radio label="Мужчина" value="male"></v-radio>
            <v-radio label="Женщина" value="female"></v-radio>
            <v-radio label="Любой" value="any"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>