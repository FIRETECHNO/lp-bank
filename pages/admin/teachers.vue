<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
  layout: "admin-cabinet",
})

import { toast } from 'vue3-toastify';

let adminStore = useAdmin();

let rightsDialog = ref<boolean>(false);
let currentUserId = ref<string>("")

let possibleRights = ref<string[]>(["can-start-lessons"])
let selectedRights = ref<string[]>([])

let emailToFind = ref<string>("")

let teachers = computed(() => adminStore.teachers.value)

function openRightsDialog(userId: string) {
  currentUserId.value = userId;
  rightsDialog.value = true;
}

async function findTeachers() {
  await adminStore.fetchTeachers(emailToFind.value);
}

async function updateTeacherRights() {
  let res = await adminStore.updateTeacherRights(currentUserId.value, selectedRights.value)
  if (res.success) {
    toast("Успешно обновлено!", {
      type: "success",
      autoClose: 300,
      onClose: () => {
        rightsDialog.value = false;
        currentUserId.value = ""
      }
    })
  }
}
</script>
<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="11" xl="10">
      <v-row>
        <v-col cols="12">
          <p class="text-h5 font-weight-bold">Список репетиторов</p>
        </v-col>
        <v-col cols="10">
          <v-text-field placeholder="teacher@gmail.com" type="email" variant="outlined" hide-details
            v-model="emailToFind"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="findTeachers" class="h-100">найти</v-btn>
        </v-col>
        <v-col v-if="teachers.length > 0" v-for="(teacher, index) in teachers" :key="index" cols="6">
          <v-card>
            {{ teacher }}
            <v-card-actions>
              <v-btn @click="openRightsDialog(teacher._id)">дать права</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col v-else cols="12" class="d-flex justify-center">
          Воспользуйтесь поиском
        </v-col>
      </v-row>

      <v-dialog v-model="rightsDialog" width="auto">
        <v-card min-width="500">
          <v-card-title>Выбор прав</v-card-title>
          <v-card-text>
            <v-select placeholder="Выберите право" :items="possibleRights" multiple v-model="selectedRights"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" variant="tonal" @click="updateTeacherRights">отправить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>