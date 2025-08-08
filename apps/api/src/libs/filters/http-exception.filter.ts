import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Something went wrong, check your request and try again' };

    const message =
      typeof responseBody === 'string'
        ? responseBody
        : 'message' in responseBody
        ? responseBody.message
        : 'Something went wrong, check your request and try again';

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
