import * as Koa from 'koa';
import { User } from './services/users';

export interface State extends Koa.DefaultState {
  user: User;
}
