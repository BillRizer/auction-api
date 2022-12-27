import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { LoggerAdapter } from '../../logger/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;
      const contentLength = response.get('content-length');
      const user: any = request.user;

      const payload: any = {
        context: 'logger.middleware',
        message: '',
        method: method,
        statusCode: statusCode,
        contentLength: +contentLength,
        userAgent: userAgent,
        userId: user?.id,
        route: originalUrl,
        ip: ip,
      };

      if (statusCode >= 500) {
        return LoggerAdapter.log('error', payload);
      }

      if (statusCode >= 400) {
        return LoggerAdapter.log('log', payload);
      }

      return LoggerAdapter.log('requests', payload);
    });

    next();
  }
}
