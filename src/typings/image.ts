export interface PostImageRes {
  image_path: string;
  image_id: string;
  token: TokenResponse;
}

export interface TokenResponse {
  presigned_url: string;
  start_time: number;
  expired_time: number;
}
