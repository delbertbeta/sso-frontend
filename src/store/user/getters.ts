import { RootState, UserState } from '$store/typings';
import { GetterTree } from 'vuex';

export const getters: GetterTree<UserState, RootState> = {
  self: (state: UserState) => state.self,
};
