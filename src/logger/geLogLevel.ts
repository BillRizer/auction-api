import { LogLevel } from '@nestjs/common/services/logger.service';
import { EEnvironments } from '../utils/helpers';

function getLogLevels(env: EEnvironments): LogLevel[] {
  if (env === EEnvironments.PROD) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}

export default getLogLevels;
