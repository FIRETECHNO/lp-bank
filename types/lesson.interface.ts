import type { EducationForm } from "./education-form.interface";

export interface Lesson extends EducationForm {
  teacher: string;
  student: string;
  dateTime: string;
  isFirstLesson: boolean;
  miroBoardUrl: string | null;
  isStarted: boolean;
  isFinished: boolean;

  _id?: string // from db
}