import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (request.url === '/auth/login' && status === 401) {
      const message = 'Usuario o contraseña erroneos, verificar.';
      response.status(status).json({
        statusCode: status,
        message,
      });
    } else {
      let message = response.statusMessage;
      switch (status) {
        case 401:
          message = 'Acceso no autorizado.';
          break;
        case 500:
          message = 'Error en el servidor contactar a soporte.';
          break;
        case 404:
          message = 'Recurso no encontrado, verificar';
          break;
      }
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
