import LessonApi from "~/api/LessonApi"
import type { Lesson } from "~/types/lesson.interface"



export function useLesson() {
  let currentLesson = ref<Lesson | null>(null)

  async function getLessonById(lessonId: string) {
    currentLesson.value = await LessonApi.getLessonById(lessonId);
  }

  async function finishLesson(lessonId: string): Promise<{ success: boolean }> {
    return await LessonApi.finishLesson(lessonId)
  }

  return {
    // variables
    currentLesson,
    // functions
    getLessonById, finishLesson,
  }
}