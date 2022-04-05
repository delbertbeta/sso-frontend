import { User } from '$typings/user';
import { MutationTree } from 'vuex';
import { UserState } from '$store/typings';

export const mutations: MutationTree<UserState> = {
  setSelfInfo(state, info: User) {
    state.self = info;
  },
};
