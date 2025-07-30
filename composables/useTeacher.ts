
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

  return {
    // functions
    updateTeacherSummary,
    // variables
    lessons,
  }
}