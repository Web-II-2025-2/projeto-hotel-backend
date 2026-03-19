const winston = require('winston');
import chalk from 'chalk';

const logFormat = winston.format.printf(({ level, message, timestamp }: any)  => {
  const cleanLevel = level.replace(/\u001b\[[0-9;]*m/g, '').toUpperCase();
  
  let levelColor = chalk.white;
  if (cleanLevel === 'INFO') levelColor = chalk.green;
  if (cleanLevel === 'WARN') levelColor = chalk.yellow;
  if (cleanLevel === 'ERROR') levelColor = chalk.red;
  
  const coloredTimestamp = chalk.cyan(timestamp);

  return `[${levelColor(cleanLevel)}] ${coloredTimestamp} : ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      logFormat
    )
  }));
}

export default logger;