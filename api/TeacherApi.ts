import type { TeacherSummary } from "~/types/user.interface"

export default {
  updateTeacherSummary(teacherId: string, summary: TeacherSummary): Promise<{ success: boolean }> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<{ success: boolean }>('/teacher/update-teacher-summary', {
      method: 'POST',
      body: { teacherId, summary }
    });
  },
}