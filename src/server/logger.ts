import { createLogger, format, transports, Logger } from 'winston';

const logger: Logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'logs.log' })]
});

export { logger };