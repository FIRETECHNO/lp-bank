
import TeacherApi from "~/api/TeacherApi";
// types
import type { TeacherSummary } from "~/types/user.interface";

export function useTeacher() {
  async function updateTeacherSummary(summary: TeacherSummary) {
    let { user } = useAuth();
    if (!user?._id) return;

    let res = await TeacherApi.updateTeacherSummary(user._id, summary)

    console.log(res);
  }
  return {
    // functions
    updateTeacherSummary,
  }
}