
import AdminApi from "~/api/AdminApi";
// types
import type { User } from "~/types/user.interface";

export function useAdmin() {

  let teachers = ref<User[]>([])
  let students = ref<User[]>([])

  async function fetchAllTeachers() {
    let res = await AdminApi.fetchAllTeachers();

    teachers.value = res;
  }

  /**
   * 
   * @param email email to find by regex
   */
  async function fetchTeachers(email: string) {
    let res = await AdminApi.fetchTeachers(email);

    teachers.value = res;
  }

  /**
   * 
   * @param teacherId id of teacher to update
   * @param newRights the new rights for this teacher 
   */
  async function updateTeacherRights(teacherId: string, newRights: string[]) {
    let res = await AdminApi.updateTeacherRights(teacherId, newRights)
    return res
  }

  async function fetchStudents(email: string) {
    let res = await AdminApi.fetchStudents(email);

    students.value = res;
  }

  return {
    // variables
    teachers, students,
    // functions
    fetchTeachers, fetchAllTeachers, updateTeacherRights, fetchStudents,
  }
}