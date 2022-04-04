export interface Rsa {
  public_key: string;
  expires: number;
  token: string;
}

export interface LocalStorageRsa {
  write_at: number;
  data: Rsa;
}
