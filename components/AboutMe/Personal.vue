<script setup lang="ts">
let form = reactive({
  gender: "",
  langLevel: null,
  age: undefined,
})
const langLevels = [
  {
    name: 'Начальный',
    description: 'Могу говорить на бытовые темы',
    filterKey: "beginner"
  },
  {
    name: 'Средний',
    description: 'Могу говорить на бытовые и профессиональные темы',
    filterKey: "intermediate"
  },
  {
    name: 'Высокий',
    description: 'Могу говорить практически на любые темы',
    filterKey: "high"
  },
]

function langLevelItemProps(item: Record<string, string>) {
  return {
    title: item.name,
    subtitle: item.description,
  }
}
</script>
<template>
  <!-- пол -->
  <!-- возраст -->
  <!-- Уровень иврита -->
  <!-- цель разговорной практики, опишите идеального партнера -->
  <v-card class="d-flex flex-column pa-4">
    <v-row>
      <v-col cols="12">
        <h1>Личная информация</h1>
      </v-col>
      <v-col cols="12">
        <v-radio-group inline v-model="form.gender">
          <v-radio label="Мужчина" value="male"></v-radio>
          <v-radio label="Женщина" value="female"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="6">
        <v-select v-model="form.langLevel" :item-props="langLevelItemProps" :items="langLevels" label="Уровень иврита"
          variant="outlined"></v-select>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="form.age" :max="100" :min="10" label="Ваш возраст" type="number"
          variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea label="Опишите идеального партнера" variant="outlined"></v-textarea>
      </v-col>
    </v-row>
  </v-card>
</template>