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
  }
}