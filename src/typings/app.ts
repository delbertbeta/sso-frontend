export interface AppBase {
  id: string;
  name: string;
  description: string;
  homepage_url: string;
  authorization_callback_url: string;
  icon_id: string;
  creator_id: string;
}

export interface AppWithIconUrl extends Omit<AppBase, 'icon_id'> {
  icon_url: string;
}

export interface AppSecret {
  id: number;
  secret: string;
  created_at: string;
}

export interface AppWithSecrets extends AppWithIconUrl {
  application_secrets: AppSecret[];
}

export type AppListItem = Omit<
  AppWithIconUrl,
  'authorization_callback_url' | 'creator_id'
>;

export type CreateAppParams = Omit<AppBase, 'id' | 'creator_id'>;
export type AppList = AppListItem[];
export interface AppListRes {
  applications: AppList;
}

export interface CreateAppSecretRes {
  application_secret: AppSecret;
}
