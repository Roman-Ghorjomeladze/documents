import { Request } from 'express';

export interface AuthorizedRequest extends Request {
  user: RequestUser;
}

export interface RequestUser {
  id: number;
  email: string;
}
