
import LessonApi from "~/api/LessonApi";
import TeacherApi from "~/api/TeacherApi";
import type { Lesson } from "~/types/lesson.interface";
// types
import type { TeacherSummary } from "~/types/user.interface";

export function useTeacher() {
  let lessons = ref<Lesson[]>([])

  async function updateTeacherSummary(summary: TeacherSummary): Promise<{ success: boolean }> {
    let { user } = useAuth();
    if (!user?._id) return { success: false };

    let res = await TeacherApi.updateTeacherSummary(user._id, summary)

    return res;
  }

  async function attachMiroBoard(lessonId: string, miroBoardUrl: string): Promise<Lesson> {
    return await LessonApi.attachMiroBoard(lessonId, miroBoardUrl)
  }

  async function startLesson(lessonId: string): Promise<Lesson | null> {
    const { user } = useAuth();
    if (!user?._id) return null;

    return await LessonApi.startLesson(lessonId, user?._id);
  }

  return {
    // functions
    updateTeacherSummary, attachMiroBoard, startLesson,
    // variables
    lessons,
  }
}