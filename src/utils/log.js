import Debug from 'debug';

const LogLevel = {
  none: '-',
  all: '*',
  error: 'error',
  info: 'info',
  debug: 'debug',
  warning: 'warning',
};

class Log {
 init = (level) => {
   Debug.enable(level);
 };

 error = (...args) => {
   Debug(LogLevel.error)(args.length === 1 ? args[0] : args);
 };

 info = (...args) => {
   Debug(LogLevel.info)(args.length === 1 ? args[0] : args);
 };

 debug = (...args) => {
   Debug(LogLevel.warning)(args.length === 1 ? args[0] : args);
 };

 warn = (...args) => {
   Debug(LogLevel.warning)(args.length === 1 ? args[0] : args);
 };

 LogLevel = LogLevel
}

export default new Log();
