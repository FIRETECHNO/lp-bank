<script setup lang="ts">
let form = reactive({
  gender: "",
  langLevel: null,
})
let range = ref([15, 40])

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
  <!-- уровень -->
  <!-- пол -->
  <!-- возраст -->
  <v-card class="d-flex flex-column pa-4">
    <v-row>
      <v-col cols="12">
        <h1>Каких партнеров вам показывать?</h1>
      </v-col>
      <v-col cols="12">
        <v-select v-model="form.langLevel" :item-props="langLevelItemProps" multiple :items="langLevels"
          label="Уровень иврита" variant="outlined"></v-select>
      </v-col>
      <v-col cols="12">
        Возраст от, до
        <v-range-slider v-model="range" :max="90" :min="15" :step="5" class="align-center" hide-details>
          <template v-slot:prepend>
            <v-text-field v-model="range[0]" density="compact" style="width: 70px" type="number" variant="outlined"
              hide-details single-line></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field v-model="range[1]" density="compact" style="width: 70px" type="number" variant="outlined"
              hide-details single-line></v-text-field>
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
</template>