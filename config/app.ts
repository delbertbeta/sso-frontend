export type AppEnv = 'dev' | 'staging' | 'prod';

type AppConfig = {
  port: number;
  hmrPort: number;
  clientPort: number;
  apiEndPoint: string;
};

const appConfigMap: Record<AppEnv, AppConfig> = {
  dev: {
    port: 3001,
    hmrPort: 3001,
    clientPort: 3001,
    apiEndPoint: 'https://sso-dev-api.delbertbeta.life',
  },
  staging: {
    port: 3001,
    hmrPort: 3001,
    clientPort: 3001,
    apiEndPoint: 'https://sso-staging-api.delbertbeta.life',
  },
  prod: {
    port: 3001,
    hmrPort: 3001,
    clientPort: 3001,
    apiEndPoint: 'https://sso-api.delbertbeta.life',
  },
};

export const getAppEnv = (appEnv = process.env.APP_ENV): AppEnv => {
  if (appEnv === 'dev' || appEnv === 'staging' || appEnv === 'prod') {
    return appEnv;
  }

  return 'prod';
};

export const getAppConfig = (appEnv = process.env.APP_ENV) => {
  return appConfigMap[getAppEnv(appEnv)];
};
