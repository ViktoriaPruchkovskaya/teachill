import * as Koa from 'koa';
import { MongoConnection } from '../mongo/connection';

export async function errorLogger(ctx: Koa.ParameterizedContext, err: Error): Promise<void> {
  await MongoConnection.getDb()
    .collection('errorLog')
    .insertOne({
      url: ctx.url,
      request_time: new Date(),
      error: err.message,
    });
}
