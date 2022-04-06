import { User } from '$typings/user';
import { MutationTree } from 'vuex';
import { UserState } from '$store/typings';
import { defaultState } from './state';

export const mutations: MutationTree<UserState> = {
  setSelfInfo(state, info: User) {
    state.self = info;
  },

  reset(state) {
    Object.assign(state, {
      ...defaultState,
    });
  },
};
