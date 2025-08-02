import LessonApi from "~/api/LessonApi"
import type { Lesson } from "~/types/lesson.interface"



export function useLesson() {
  let currentLesson = ref<Lesson | null>(null)

  async function getLessonById(lessonId: string) {
    currentLesson.value = await LessonApi.getLessonById(lessonId);
  }

  return {
    // variables
    currentLesson,
    // functions
    getLessonById,
  }
}