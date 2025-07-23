import type { User } from "~/types/user.interface";

export default {
  updateTeacherSummary(teacherId: string, summary: any): Promise<{ success: boolean }> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<{ success: boolean }>('/teacher/update-teacher-summary', {
      method: 'POST',
      body: { teacherId, summary }
    });
  },
  fetchAllTeachers(): Promise<User[]> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<User[]>("/teacher/get-all-teachers", {
      method: "GET"
    })
  },
  fetchTeachers(email: string): Promise<User[]> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<User[]>("/teacher/get-teachers", {
      method: "POST",
      body: { email }
    })
  },
  updateTeacherRights(teacherId: string, newRights: string[]): Promise<{ success: boolean }> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<{ success: boolean }>('/teacher/update-teacher-rights', {
      method: 'POST',
      body: { teacherId, newRights }
    });
  },
  fetchStudents(email: string): Promise<User[]> {
    const { $apiFetch } = useNuxtApp();
    return $apiFetch<User[]>("/teacher/get-students", {
      method: "POST",
      body: { email }
    })
  },
}