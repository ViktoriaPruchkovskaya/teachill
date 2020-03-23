import * as Koa from 'koa';
import { RoleType } from './services/users';

export interface State extends Koa.DefaultState {
  User: {
    id: number;
    username: string;
    fullName: string;
    role: string | RoleType;
  };
}
