<script setup lang="ts">
const userStore = useAuth();


</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="11" xl="10">
        <v-row>
          <v-col cols="12">
            <h1>Добро пожаловать</h1>
          </v-col>
          <v-col cols="4">
            <div class="card border">
              <v-row>
                <v-col cols="12">
                  <h2>Найдите партнера для изучения</h2>
                  <p class="text-caption text-color-gray">Общайтесь и учитесь вместе с другими пользователями</p>
                </v-col>
                <v-col cols="12" class="d-flex justify-center" style="font-size: 50px;;">
                  <v-icon color="primary">mdi-account-multiple-outline</v-icon>
                </v-col>
                <v-col cols="12">
                  <v-btn block color="primary" to="/matching">Найти пару</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="card border">
              <v-row>
                <v-col cols="12">
                  <h2>Ваши сообщения</h2>
                  <p class="text-caption text-color-gray">Общайтесь и учитесь вместе с другими пользователями</p>
                </v-col>
                <v-col cols="12" class="d-flex justify-center" style="font-size: 50px;;">
                  <v-icon color="success">mdi-message</v-icon>
                </v-col>
                <v-col cols="12">
                  <v-btn block variant="tonal" to="/chats">Посмотреть отклики</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="card border">
              <v-row>
                <v-col cols="12">
                  <h2>Заполните анекту</h2>
                  <p class="text-caption text-color-gray">Это поможет найти вам самый подходящий метч</p>
                </v-col>
                <v-col cols="12" class="d-flex justify-center" style="font-size: 50px;;">
                  <v-icon color="primary">mdi-account-outline</v-icon>
                </v-col>
                <v-col cols="12">
                  <v-btn block color="primary" variant="tonal" to="/me">Редактировать профиль</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <h1>Возможные партнеры</h1>
          </v-col>
          <v-col cols="12">
            <CandidatesList />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss">
.card {
  border-radius: 20px;
  padding: 20px;
  height: 100%;
}
</style>