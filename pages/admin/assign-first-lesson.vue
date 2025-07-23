<script setup lang="ts">
definePageMeta({
  middleware: ["admin"]
})
let adminStore = useAdmin();

let teacherEmailToFind = ref<string>("")
let studentEmailToFind = ref<string>("")

let teachers = computed(() => adminStore.teachers.value)
let students = computed(() => adminStore.students.value)


async function findTeachers() {
  await adminStore.fetchTeachers(teacherEmailToFind.value);
}

async function findStudents() {
  await adminStore.fetchStudents(studentEmailToFind.value);
}

function selectTeacher(teacherId: string) {
  console.log(teacherId);
}

function selectStudent(studentId: string) {
  console.log(studentId);
}
</script>
<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="11" xl="10">
      <v-row>
        <v-col cols="12">
          <p class="text-h5 font-weight-bold">Выбор Репетитора</p>
        </v-col>
        <v-col cols="10">
          <v-text-field placeholder="teacher@gmail.com" type="email" variant="outlined" hide-details
            v-model="teacherEmailToFind"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="findTeachers" class="h-100">найти</v-btn>
        </v-col>
        <v-col v-if="teachers.length > 0" v-for="(teacher, index) in teachers" :key="index" cols="6">
          <v-card>
            {{ teacher }}
            <v-card-actions>
              <v-btn @click="selectTeacher(teacher._id)">выбрать</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col v-else cols="12" class="d-flex justify-center">
          Воспользуйтесь поиском
        </v-col>


        <v-col cols="12">
          <p class="text-h5 font-weight-bold">Выбор Обучающегося</p>
        </v-col>
        <v-col cols="10">
          <v-text-field placeholder="teacher@gmail.com" type="email" variant="outlined" hide-details
            v-model="studentEmailToFind"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="findStudents" class="h-100">найти</v-btn>
        </v-col>
        <v-col v-if="teachers.length > 0" v-for="(student, index) in students" :key="index" cols="6">
          <v-card>
            {{ student }}
            <v-card-actions>
              <v-btn @click="selectStudent(student._id)">выбрать</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col v-else cols="12" class="d-flex justify-center">
          Воспользуйтесь поиском
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>