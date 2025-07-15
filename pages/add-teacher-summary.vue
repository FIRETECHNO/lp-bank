<script lang="ts" setup>
const items = [
  {
    name: "дошкольное образование",
    department: "",
  },
  {
    name: "начальное образование",
    department: "1-4 класс",
  },
  {
    name: "Основное общее образование",
    department: "5-9 класс",
  },
  {
    name: "Среднее общее образование",
    department: "10-11 клкасс",
  },
  {
    name: "Среднее профессиональное образование",
    department: "Колледжи, техникумы",
  },
  {
    name: "Высшее образование",
    department: "Бакалавриат, специалитет, магистратура, аспирантура",
  },
];

const experienceTypes = ["до 1 года", "от 1 до 2 лет", "2-4 года", "4+ года"];

let form = ref({
  educationLevel: "",
  experience: "",
  achievements: "",
  aboutMe: ""
})

function submit() {
  console.log(form.value);
}
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center align-center fill-height">
      <v-col cols="12" sm="10" md="7" xl="6">
        <span
          class="d-flex flex-column justify-center align-center text-center rounded-lg w-100 pl-6 pr-6 pt-4 pb-6 text-h4">
          Заполните анкету
        </span>
        <v-container>
          <span class="text-h6"> Ваш уровень образования </span>
          <v-select :items="items" item-title="name" label="Уровень образования" v-model="form.educationLevel">
            <template v-slot:item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :subtitle="item.raw.department"></v-list-item>
            </template>
          </v-select>
          <span class="text-h6">
            Ваш опыт работы репетитором или учителем наставником</span>
          <v-select :items="experienceTypes" label="Опыт работы" v-model="form.experience">
          </v-select>
        </v-container>
        <v-container fluid>
          <span class="text-h6"> О вас </span>
          <v-textarea clear-icon="mdi-close-circle" label="Опишите себя" v-model="form.aboutMe" clearable></v-textarea>
        </v-container>
        <v-container fluid>
          <span class="text-h6"> Ваши достижения </span>
          <v-textarea clear-icon="mdi-close-circle" label="Опишите свои достижения" v-model="form.achievements"
            clearable></v-textarea>
        </v-container>
        <v-container class="d-flex mt-3 flex-column align-center justify-center w-100">
          <v-btn type="submit" class="d-flex justify-center align-center text-center rounded-lg" @click="submit">
            Отправить
          </v-btn>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
