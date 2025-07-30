import type { Lesson } from "./lesson.interface";

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
  roles: ("student" | "teacher" | "parent" | "admin" | "user")[];

  // Teacher info
  educationLevel?: string;
  experience?: string;
  achievements?: string;
  aboutMe?: string;
  rights: string[];

  // Student info
  parentId?: string

  // Parent info
  myChildren?: string[]

  lessons: string[]
}
