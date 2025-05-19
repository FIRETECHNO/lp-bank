<script setup lang="ts">
const userStore = useAuth();


</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="11" xl="10">
        <v-row>
          <v-col cols="12" xl="8">
            <p class="mt-5 text-h4 font-weight-bold">
              Шалом!
            </p>
            <p class="mt-5 text-h6 font-weight-medium">
              Добро пожаловать в сообщество, влюбленных в Иврит.
            </p>

            <p class="mt-2 text-h6">
              Здесь ты можешь найти идеального собеседника и партнера для языковой практики на основе своих предпочтений
              и
              интересов, завести новых друзей.
            </p>
            <p class="mt-2 text-h6">
              Заполни <NuxtLink class="text-primary" to="/about-me-form">анкету</NuxtLink>, начни общение в чате и
              продолжи на видеозвонке!
            </p>
          </v-col>
          <v-col cols="0" xl="4"></v-col>

          <v-col cols="12" md="4">
            <div class="card border">
              <v-row>
                <v-col cols="12">
                  <p class="text-h5 font-weight-bold">Найдите партнера для изучения</p>
                  <p class="text-caption text-color-gray">Общайтесь и учитесь вместе с другими пользователями</p>
                </v-col>
                <v-col cols="12" class="d-flex justify-center" style="font-size: 50px;;">
                  <v-icon color="primary">mdi-account-multiple-outline</v-icon>
                </v-col>
                <v-col cols="12">
                  <v-btn block color="primary" to="#candidates-list">Найти пару</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="card border">
              <v-row>
                <v-col cols="12">
                  <p class="text-h5 font-weight-bold">Ваши сообщения</p>
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
          <v-col cols="12" md="4">
            <div class="card border">
              <v-row>
                <v-col cols="12">
                  <p class="text-h5 font-weight-bold">Заполните анкету</p>
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

        <v-row id="candidates-list">
          <v-col cols="12">
            <p class="text-h4 font-weight-bold">Возможные партнеры</p>
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