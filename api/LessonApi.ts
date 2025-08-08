import type { Lesson } from "~/types/lesson.interface";

export default {
  attachMiroBoard(lessonId: string, miroBoardUrl: string): Promise<Lesson> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<Lesson>('/lesson/attach-miro-board', {
      method: 'POST',
      body: { lessonId, miroBoardUrl }
    });
  },
  getLessonById(lessonId: string): Promise<Lesson | null> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<Lesson | null>(`/lesson/get-by-id?_id=${lessonId}`, {
      method: 'GET',
    });
  },
  startLesson(lessonId: string, teacherId: string): Promise<Lesson | null> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<Lesson | null>(`/lesson/start-lesson?lesson_id=${lessonId}&teacher_id=${teacherId}`, {
      method: 'GET',
    });
  },
  finishLesson(lessonId: string): Promise<{ success: boolean }> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<{ success: boolean }>(`/lesson/finish?lesson_id=${lessonId}`, {
      method: 'GET',
    });
  }
}