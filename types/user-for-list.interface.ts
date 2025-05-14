import type { User } from "./user.interface";

export interface UserForList extends User {
  isLiked: boolean
}