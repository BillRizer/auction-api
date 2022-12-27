import { configure, getLogger } from 'log4js';

const filePathLogs = process.env.LOG_PATH;

configure({
  appenders: {
    error: {
      type: 'file',
      filename: filePathLogs + '/error.log',
      maxLogSize: 20480000,
      backups: 50,
      layout: { type: 'dummy' },
    },
    log: {
      type: 'file',
      filename: filePathLogs + '/log.log',
      maxLogSize: 20480000,
      backups: 50,
      layout: { type: 'dummy' },
    },

    requests: {
      type: 'file',
      filename: filePathLogs + '/requests.log',
      maxLogSize: 20480000,
      backups: 50,
      layout: { type: 'dummy' },
    },

    activities: {
      type: 'file',
      filename: filePathLogs + '/activities.log',
      maxLogSize: 20480000,
      backups: 50,
      layout: { type: 'dummy' },
    },

    debug: {
      type: 'file',
      filename: filePathLogs + '/debug.log',
      maxLogSize: 20480000,
      backups: 50,
      layout: { type: 'dummy' },
    },
  },
  categories: {
    default: { appenders: ['debug'], level: 'all' },
    error: { appenders: ['error'], level: 'all' },
    log: { appenders: ['log'], level: 'all' },
    requests: { appenders: ['requests'], level: 'all' },
    activities: { appenders: ['activities'], level: 'all' },
  },
});
// requests -> used in middleware, for view requests
// error -> any error in api
// activities -> all actions performed by the user
// debug -> all debug info

// for receive only info, change:
//      categories.default.level: "info"
type ILogType = 'error' | 'log' | 'requests' | 'activities' | 'debug';
export abstract class LoggerAdapter {
  // initialize the var to use.
  private static loggerDefault = getLogger('default');
  private static loggerError = getLogger('error');
  private static loggerLog = getLogger('log');
  private static loggerRequests = getLogger('requests');
  private static loggerActivities = getLogger('activities');
  // public static loggerDebug = getLogger('debug');

  public static log(type: ILogType, payload: ILoggerPayload): void {
    // const _payload = JSON.stringify({
    //   timestamp: new Date().toISOString(),
    //   ...payload,
    // });
    const {
      context,
      message,
      contentLength,
      ip,
      method,
      route,
      statusCode,
      userAgent,
      userId,
    } = payload;
    const _payload = `${type.toUpperCase()}|${new Date().toISOString()}|${contentLength}|${context}|${method}|${statusCode}|${route}|${userId}|${message}|${userAgent}|${ip}`;
    this.send(type, _payload);
  }
  public static logRawMessage(type: ILogType, message: string): void {
    this.send(type, message);
  }
  private static send(type: ILogType, message: string) {
    const _message = `${new Date().toISOString()}|${message}`;
    switch (type) {
      case 'error':
        this.loggerError.log(_message);
        break;
      case 'log':
        this.loggerLog.log(_message);
        break;
      case 'requests':
        this.loggerRequests.log(_message);
        break;
      case 'activities':
        this.loggerActivities.log(_message);
        break;
      //anything unknowed is debug
      default:
        this.loggerDefault.log(_message);
        break;
    }
  }
}
export interface ILoggerPayload {
  // timestamp: new Date().toISOString(),
  // timestamp: string,
  context: string;
  message: string;
  method?: string;
  statusCode?: number;
  contentLength?: number;
  userAgent?: string;
  userId?: string;
  userEmail?: string;
  route?: string;
  ip?: string;
}
