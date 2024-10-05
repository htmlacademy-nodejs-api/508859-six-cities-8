import { Logger as PinoInstance, pino, transport } from 'pino';
import { injectable } from 'inversify';
import { resolve } from 'node:path';

import { getCurrentModuleDirectoryPath } from '../../helpers/index.js';
import { Logger } from './logger.interface.js';
import { FILE_TRANSPORT_FORMAT, LOG_FILE_PATH_DEFAULT } from './logger.constant.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = LOG_FILE_PATH_DEFAULT;
    const destination = resolve(modulePath, '../../../', logFilePath);

    const multiTransport = transport({
      targets: [
        {
          target: FILE_TRANSPORT_FORMAT,
          options: { destination },
          level: 'debug'
        },
        {
          target: FILE_TRANSPORT_FORMAT,
          level: 'info',
          options: {},
        }
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}