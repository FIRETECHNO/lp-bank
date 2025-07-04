<script setup lang="ts">
const userStore = useAuth();

const schoolSubjects = [
  'Математика', 'Русский язык', 'Английский язык', 'Химия',
  'Информатика', 'Обществознание', 'Физика', 'История',
  'Биология', 'Литература', 'География'
]

const exams = ['ВПР', 'ОГЭ', 'ЕГЭ', 'ДВИ']

const reviews = [
  {
    id: 1,
    name: 'Анна Петрова',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face',
    text: 'Отличная платформа! Нашли замечательного репетитора по математике для дочери. Результаты видны уже через месяц.'
  },
  {
    id: 2,
    name: 'Михаил Иванов',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
    text: 'Удобная система бронирования занятий. Сын с удовольствием занимается английским языком.'
  },
  {
    id: 3,
    name: 'Елена Сидорова',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face',
    text: 'Профессиональные преподаватели и гибкий график. Рекомендую всем родителям!'
  }
]

const faqs = [
  {
    id: 1,
    question: 'Как выбрать подходящего репетитора?',
    answer: 'Вы можете ознакомиться с профилями преподавателей, их опытом, отзывами других учеников и выбрать наиболее подходящего. Также доступно бесплатное пробное занятие.'
  },
  {
    id: 2,
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем оплату банковскими картами, через электронные кошельки и банковские переводы. Оплата производится после проведения занятия.'
  },
  {
    id: 3,
    question: 'Можно ли отменить или перенести занятие?',
    answer: 'Да, вы можете отменить или перенести занятие не позднее чем за 24 часа до его начала без дополнительных комиссий.'
  },
  {
    id: 4,
    question: 'Как проходят онлайн-занятия?',
    answer: 'Занятия проводятся через нашу встроенную платформу видеосвязи с интерактивной доской и возможностью обмена файлами.'
  }
]

useHead({
  title: 'EduPlatform - Найдите лучшего репетитора для вашего ребенка',
  meta: [
    { name: 'description', content: 'Образовательная платформа для поиска квалифицированных репетиторов. Индивидуальный подход, гибкий график, проверенные преподаватели.' }
  ]
})
</script>
<template>
  <v-row class="d-flex justify-center align-center">
    <v-col cols="12" md="11" xl="10">
      <!-- Hero Section -->
      <v-row align="center" class="py-16 min-height-400">
        <v-col cols="12" md="6">
          <h1 class="text-h2 font-weight-bold mb-6">
            Найдите лучшего репетитора для вашего ребенка
          </h1>
          <p class="text-h6 text-grey-darken-1 mb-8">
            Качественное образование с проверенными преподавателями.
            Индивидуальный подход к каждому ученику.
          </p>
          <v-btn color="primary" size="x-large" class="text-none mr-4">
            Найти репетитора
          </v-btn>
          <v-btn variant="outlined" color="primary" size="x-large" class="text-none">
            Стать репетитором
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg" alt="Обучение"
            class="rounded-lg" cover />
        </v-col>
      </v-row>

      <!-- Features Section -->
      <v-row class="py-16">
        <v-col cols="12" md="4" class="mb-8">
          <v-card class="pa-8 h-100" elevation="2" rounded="lg">
            <v-icon icon="mdi-account-school" size="64" color="primary" class="mb-4" />
            <h3 class="text-h5 font-weight-bold mb-4">
              Для родителей
            </h3>
            <p class="text-body-1 text-grey-darken-1">
              Найдите квалифицированного репетитора для вашего ребенка.
              Удобная система бронирования и оплаты занятий.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="mb-8">
          <v-card class="pa-8 h-100" elevation="2" rounded="lg">
            <v-icon icon="mdi-teach" size="64" color="secondary" class="mb-4" />
            <h3 class="text-h5 font-weight-bold mb-4">
              Для репетиторов
            </h3>
            <p class="text-body-1 text-grey-darken-1">
              Развивайте свою преподавательскую карьеру.
              Гибкий график и стабильный доход.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="mb-8">
          <v-card class="pa-8 h-100" elevation="2" rounded="lg">
            <v-icon icon="mdi-school" size="64" color="accent" class="mb-4" />
            <h3 class="text-h5 font-weight-bold mb-4">
              Для учеников
            </h3>
            <p class="text-body-1 text-grey-darken-1">
              Интерактивные занятия с опытными преподавателями.
              Индивидуальный подход к обучению.
            </p>
          </v-card>
        </v-col>
      </v-row>


      <!-- Subjects Section -->
      <v-row>
        <v-col cols="12">
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold mb-4">Школьные предметы</h2>
            <p class="text-h6 text-grey-darken-1">
              Широкий выбор предметов для всех классов
            </p>
          </div>
        </v-col>
        <v-col cols="6" md="3" lg="2" v-for="subject in schoolSubjects" :key="subject">
          <v-chip size="large" color="primary" variant="tonal" class="ma-1 pa-4" block>
            {{ subject }}
          </v-chip>
        </v-col>

        <v-col cols="12">
          <h2 class="text-center mb-12 mt-16 text-h3 font-weight-bold mb-4">Подготовка к экзаменам</h2>
        </v-col>
        <v-col cols="6" md="3" v-for="exam in exams" :key="exam">
          <v-chip size="large" color="secondary" variant="tonal" class="ma-1 pa-4" block>
            {{ exam }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="py-16 pa-12 text-center" color="primary" rounded="lg">
            <h2 class="text-h3 font-weight-bold text-white mb-6">
              Готовы начать обучение?
            </h2>
            <p class="text-h6 text-white mb-8 opacity-90">
              Присоединяйтесь к тысячам довольных учеников и родителей
            </p>
            <v-btn color="white" size="x-large" class="text-none text-primary">
              Записаться на бесплатное занятие
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <!-- Reviews Section -->
      <v-row class="py-16">
        <v-col cols="12">
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold mb-4">Отзывы</h2>
            <p class="text-h6 text-grey-darken-1">
              Что говорят наши клиенты
            </p>
          </div>
        </v-col>
        <v-col cols="12" md="4" v-for="review in reviews" :key="review.id">
          <v-card class="pa-6 h-100" elevation="2" rounded="lg">
            <div class="d-flex align-center mb-4">
              <v-avatar size="48" class="mr-3">
                <v-img :src="review.avatar" />
              </v-avatar>
              <div>
                <h4 class="font-weight-bold">{{ review.name }}</h4>
                <div class="d-flex">
                  <v-icon v-for="i in 5" :key="i" icon="mdi-star" color="amber" size="small" />
                </div>
              </div>
            </div>
            <p class="text-body-1">{{ review.text }}</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- FAQ Section -->
      <v-row justify="center" class="py-16">
        <v-col cols="12">
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold mb-4">FAQ</h2>
            <p class="text-h6 text-grey-darken-1">
              Часто задаваемые вопросы
            </p>
          </div>
        </v-col>
        <v-col cols="12" md="8">
          <v-expansion-panels>
            <v-expansion-panel v-for="faq in faqs" :key="faq.id" :title="faq.question" :text="faq.answer" />
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped lang="scss">
.card {
  border-radius: 20px;
  padding: 20px;
  height: 100%;
}
</style>