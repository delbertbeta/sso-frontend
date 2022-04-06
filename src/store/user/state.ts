import { UserState } from '$store/typings';

export const defaultState = {
  self: null,
};

export const state = (): UserState => ({
  ...defaultState,
});
