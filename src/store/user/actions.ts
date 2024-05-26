import { getSelfInfo } from '$api/request';
import { ActionTree } from 'vuex';
import { RootState, UserState } from '$store/typings';
import { MessagePlugin } from 'tdesign-vue-next';
import router from '$router/router';
import { safeSetStorage } from '$utils/local-storage';
import { LastPath } from '$typings/path';
import { RouteName } from '$constants/router';

export const actions: ActionTree<UserState, RootState> = {
  async getSelfInfo({ commit }) {
    const selfInfo = await getSelfInfo();
    if (selfInfo.isErr) {
      if (selfInfo.response.code === 106) {
        safeSetStorage<LastPath>('last_path', {
          path: router.currentRoute.value.fullPath,
        });
        router.push({ name: RouteName.Login });
      } else {
        MessagePlugin.error(
          '获取登录信息失败，请刷新重试：' + selfInfo.response.msg
        );
      }
    } else {
      commit('setSelfInfo', selfInfo.response.data);
    }
  },
};
