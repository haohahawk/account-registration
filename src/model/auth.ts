
export interface User {
  accountId: string;
  password?: string;
}

export interface Token {
  token: string;
  tokenType: string;
  expiredTime: number;
  user: Pick<User, 'accountId'>;
}

export interface RequestHeaderWithToken {
  authorization: string;
}
