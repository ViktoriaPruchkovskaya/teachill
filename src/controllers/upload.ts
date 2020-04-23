import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { LocalFileUploadService, FileUploadService } from '../services/upload';

export async function fileUploadHandler(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const fileService: FileUploadService = new LocalFileUploadService();
  const filePath = await fileService.upload(ctx.request.file);
  ctx.body = {
    filePath: `${ctx.protocol}://${ctx.host}/${filePath}`,
  };
  ctx.response.status = httpCodes.OK;
  await next();
}
