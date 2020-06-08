import * as Koa from 'koa';
import { MongoConnection } from '../mongo/connection';
import { performance } from 'perf_hooks';

export async function accessLogger(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const requestTime = performance.now();
  const collection = MongoConnection.getDb().collection('accessLog');

  await next();

  const responseTime = performance.now();

  await collection.insertOne({
    ip: ctx.request.ip,
    url: ctx.url,
    circulation_time: requestTime,
    duration: responseTime - requestTime,
  });
}
