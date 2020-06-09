import * as Koa from 'koa';
import { MongoConnection } from '../mongo/connection';
import { performance } from 'perf_hooks';

export async function accessLogger(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const requestTime = Date.now();

  const responseStartTime = performance.now();
  await next();

  const responseEndTime = performance.now();

  const collection = MongoConnection.getDb().collection('accessLog');
  await collection.insertOne({
    ip: ctx.request.ip,
    url: ctx.url,
    request_time: requestTime,
    duration: responseEndTime - responseStartTime,
  });
}
