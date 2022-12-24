import { join } from 'path';

export enum EEnvironments {
  DEV = 'DEV',
  TEST = 'TEST',
  PROD = 'PROD',
}
export const getEnvironment = (): EEnvironments => {
  if (!process.env.ENV) {
    throw new Error('Environment needs to be defined');
  }
  const env = EEnvironments[process.env.ENV.toUpperCase()];
  if (!env) {
    throw new Error(
      'Environment need be DEV, TEST or PROD (no case sensitivity)',
    );
  }
  return env;
};
export const envFilePath = join(__dirname, '../../');

