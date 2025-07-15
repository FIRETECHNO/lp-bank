import type { TeacherSummary } from "~/types/user.interface"

export default {
  updateTeacherSummary(teacherId: string, summary: TeacherSummary): Promise<any> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<any>('/teacher/update-teacher-summary', {
      method: 'POST',
      body: { teacherId, summary }
    });
  },
}