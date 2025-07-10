export interface Role {
  type: "student" | "teacher" | "parent" | "admin" | "user";
}

export interface PartnerFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  langLevel?: LangLevel[];
  partnerDiscription?: string;
}
export interface LangLevel {
  name?: string;
  description?: string;
}
export interface User {
  _id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  roles: Role[];
  // from page /about-me-form:
  gender?: string;
  age?: number;
  langLevel?: LangLevel;
  partnerFilters?: PartnerFilters;
  idealPartnerDescription?: string;
}
