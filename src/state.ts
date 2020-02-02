import * as Koa from 'koa';

export interface State extends Koa.DefaultState {
  username: string;
}
