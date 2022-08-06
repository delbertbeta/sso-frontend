export interface AppBase {
  id: string;
  name: string;
  description: string;
  homepage_url: string;
  authorization_callback_url: string;
  icon_id: string;
  creator_id: string;
}

export type CreateAppParams = Omit<AppBase, 'id' | 'creator_id'>