import { InjectionKey } from 'vue';
import { createStore, createLogger, Store } from 'vuex';
import { RootState } from './typings';
import user from './user';

const debug = process.env.NODE_ENV !== 'production';

export const key: InjectionKey<Store<RootState>> = Symbol()

export default createStore<RootState>({
  modules: {
    user,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
