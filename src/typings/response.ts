export interface OkResponse<T> {
  code: number;
  data: T;
}

export interface ErrResponse {
  code: number,
  msg: string,
}

export interface SuccessResult<T> {
  response: T;
  isErr: false;
}

export interface ErrorResult<T> extends SuccessResult<T> {
  response: T;
  isErr: true;
}
