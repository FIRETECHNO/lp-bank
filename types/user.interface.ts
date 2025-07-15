export interface Role {
  type: "student" | "teacher" | "parent" | "admin" | "user";
}

export interface TeacherSummary {
  educationLevel: string;
  experience: string;
  achievements: string;
  aboutMe: string;
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  roles: Role[];

  //Teacher info
  educationLevel?: string;
  experience?: string;
  achievements?: string;
  aboutMe?: string;
}
