import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message = response.statusMessage;
    if (request.url === '/auth/login' && (status === 401 || status === 404)) {
      message = 'Usuario o contraseña erroneos, verificar.';
      response.status(status).json({
        statusCode: status,
        message,
      });
    } else {
      if (!message) {
        const exceptionResp = exception.getResponse();
        if (exception.message) {
          message = exception.message;
        } else {
          message = exceptionResp['message' as keyof object];
        }
      }
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
