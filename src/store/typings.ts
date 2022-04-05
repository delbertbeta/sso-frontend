import { User } from '$typings/user';

export interface UserState {
  self: User | null;
}

export interface RootState {
  user: UserState;
}
