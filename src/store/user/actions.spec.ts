import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  getSelfInfoMock,
  pushMock,
  safeSetStorageMock,
  messageErrorMock,
} = vi.hoisted(() => ({
  getSelfInfoMock: vi.fn(),
  pushMock: vi.fn(),
  safeSetStorageMock: vi.fn(),
  messageErrorMock: vi.fn(),
}));

vi.mock('$api/request', () => ({
  getSelfInfo: getSelfInfoMock,
}));

vi.mock('$router/router', () => ({
  default: {
    currentRoute: {
      value: {
        name: 'index',
        path: '/',
        fullPath: '/',
      },
    },
    push: pushMock,
  },
}));

vi.mock('$utils/local-storage', () => ({
  safeSetStorage: safeSetStorageMock,
}));

vi.mock('tdesign-vue-next', () => ({
  MessagePlugin: {
    error: messageErrorMock,
  },
}));

import router from '$router/router';
import { actions } from './actions';

describe('user actions', () => {
  beforeEach(() => {
    getSelfInfoMock.mockReset();
    pushMock.mockReset();
    safeSetStorageMock.mockReset();
    messageErrorMock.mockReset();
  });

  it('persists the current protected route and redirects to login on 106', async () => {
    router.currentRoute.value = {
      name: 'user',
      path: '/user',
      fullPath: '/user',
    };

    getSelfInfoMock.mockResolvedValue({
      isErr: true,
      response: {
        code: 106,
        msg: 'unauthorized',
      },
    });

    await actions.getSelfInfo({
      commit: vi.fn(),
    } as never);

    expect(safeSetStorageMock).toHaveBeenCalledWith('last_path', {
      path: '/user',
    });
    expect(pushMock).toHaveBeenCalledWith({ name: 'login' });
  });

  it('does not overwrite last_path when already on the login route', async () => {
    router.currentRoute.value = {
      name: 'login',
      path: '/auth/login',
      fullPath: '/auth/login',
    };

    getSelfInfoMock.mockResolvedValue({
      isErr: true,
      response: {
        code: 106,
        msg: 'unauthorized',
      },
    });

    await actions.getSelfInfo({
      commit: vi.fn(),
    } as never);

    expect(safeSetStorageMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('commits self info when the request succeeds', async () => {
    const commit = vi.fn();

    getSelfInfoMock.mockResolvedValue({
      isErr: false,
      response: {
        code: 0,
        data: {
          id: 1,
          username: 'delbert',
          nickname: 'Delbert',
        },
      },
    });

    await actions.getSelfInfo({
      commit,
    } as never);

    expect(commit).toHaveBeenCalledWith('setSelfInfo', {
      id: 1,
      username: 'delbert',
      nickname: 'Delbert',
    });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
