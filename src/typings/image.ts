export interface PostImageRes {
  image_path: string;
  image_id: string;
  bucket: string;
  region: string;
  token: CosToken;
}

export interface CosToken {
  tmp_secret_id: string;
  tmp_secret_key: string;
  session_token: string;
  start_time: number;
  expired_time: number;
}
