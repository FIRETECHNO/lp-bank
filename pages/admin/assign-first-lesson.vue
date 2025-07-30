<script setup lang="ts">
import type { User } from '~/types/user.interface';
import type { EducationForm } from '~/types/education-form.interface';
import type { Lesson } from '~/types/lesson.interface';
import { toast } from 'vue3-toastify';

definePageMeta({
  middleware: ["admin"]
})
let adminStore = useAdmin();

let teacherEmailToFind = ref<string>("")
let studentEmailToFind = ref<string>("")

let teachers = adminStore.teachers;
let students = adminStore.students;

let selectedTeacherId = ref<string>("")
let selectedTeacher = computed<User | null>(() => {
  for (let t of teachers.value)
    if (t._id == selectedTeacherId.value)
      return t
  return null;
})
let selectedStudentId = ref<string>("")
let selectedStudent = computed<User | null>(() => {
  for (let t of students.value)
    if (t._id == selectedStudentId.value)
      return t
  return null;
})
let confirmLessonAssignmentDialog = ref<boolean>(false)

let teacherFilters = ref<EducationForm>();
let lessonDate = ref<string>("")
let lessonTime = ref<string>("")

watch([selectedTeacherId, selectedStudentId], ([newTeacher, newStudent]) => {
  if (newTeacher != "" && newStudent != "") {
    confirmLessonAssignmentDialog.value = true;
  }
})

async function findTeachers() {
  await adminStore.fetchTeachers(teacherEmailToFind.value);
}

async function findStudents() {
  await adminStore.fetchStudents(studentEmailToFind.value);
}

function selectTeacher(teacherId: string) {
  selectedTeacherId.value = teacherId;
}

function selectStudent(studentId: string) {
  selectedStudentId.value = studentId;
}

function handleTeacherFiltersUpdate(data: EducationForm) {
  teacherFilters.value = data;
}

function closeDialog() {
  confirmLessonAssignmentDialog.value = false;
  selectedTeacherId.value = "";
  selectedStudentId.value = "";
}

async function submit() {
  if (!teacherFilters.value?.goals.length) return;
  let hour = Number(lessonTime.value.split(":")[0])
  let minute = Number(lessonTime.value.split(":")[1])

  let dateTime = new Date(lessonDate.value)

  dateTime.setHours(hour);
  dateTime.setMinutes(minute);

  let ISODateTime = dateTime.toISOString();

  let toSend: Lesson = {
    ...teacherFilters.value,
    teacher: selectedTeacherId.value,
    student: selectedStudentId.value,
    dateTime: ISODateTime,
    isFirstLesson: true,
  }

  let res = await adminStore.assignFirstLesson(toSend)
  if (res.success) {
    toast("Успешно!", {
      type: "success",
      autoClose: 600,
      onClose: closeDialog
    })
  }
}
</script>
<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="11" xl="10">
      <v-row>
        <v-col cols="12">
          <p class="text-h4 font-weight-bold">Выбор Репетитора</p>
        </v-col>
        <v-col cols="10">
          <v-text-field placeholder="teacher@gmail.com" type="email" variant="outlined" hide-details
            v-model="teacherEmailToFind"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="findTeachers" class="h-100">найти</v-btn>
        </v-col>
        <v-col v-if="teachers.length > 0" v-for="(teacher, index) in teachers" :key="index" cols="6">
          <v-card :color="teacher._id == selectedTeacherId ? 'success' : ''">
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
          <p class="text-h4 font-weight-bold">Выбор Обучающегося</p>
        </v-col>
        <v-col cols="10">
          <v-text-field placeholder="teacher@gmail.com" type="email" variant="outlined" hide-details
            v-model="studentEmailToFind"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="findStudents" class="h-100">найти</v-btn>
        </v-col>
        <v-col v-if="teachers.length > 0" v-for="(student, index) in students" :key="index" cols="6">
          <v-card :color="student._id == selectedStudentId ? 'success' : ''">
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

      <v-dialog v-model="confirmLessonAssignmentDialog" width="auto" persistent>
        <v-card min-width="500">
          <v-card-text>
            <p class="text-h5 font-weight-bold">Репетитор</p>
            {{ selectedTeacher }}

            <p class="text-h5 font-weight-bold">Ученик</p>
            {{ selectedStudent }}

            <v-row>
              <v-col cols="12" class="d-flex justify-center">
                <TeacherTagsFilter @submit="handleTeacherFiltersUpdate" />
              </v-col>

              <v-col cols="6">
                <v-date-picker v-model="lessonDate" show-adjacent-months header="Выберите дату"
                  landscape></v-date-picker>
              </v-col>
              <v-col cols="6">
                <v-time-picker v-model="lessonTime" format="24hr"></v-time-picker>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="closeDialog">отмена</v-btn>
            <v-btn color="success" @click="submit">подтвердить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>