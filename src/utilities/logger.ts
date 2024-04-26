export type Log = {
  type: "error" | "info" | "debug" | "exception";
  exception?: Error;
  message?: any;
};

const canDebug = true;
export const Logger = {
  debug: (message: string, data: any) => {
    if (canDebug) {
      Logger.message({
        message: { message: message, data: data },
        type: "debug",
      });
    }
  },
  info: (message: string) => {
    Logger.message({
      message: message,
      type: "info",
    });
  },
  exception: (exception: Error) => {
    Logger.message({
      message: exception.message,
      type: "error",
      exception: exception,
    });
  },
  error: (message: string | undefined | unknown) => {
    Logger.message({
      message: message,
      type: "error",
    });
  },
  message: (log: Log) => {
    switch (log?.type) {
      case "error":
        if (log?.exception) {
          console.error(log.message, log.exception);
        } else {
          console.error(log);
        }
        break;
      case "info":
        console.log(log);
        break;
      case "debug":
        console.debug(log);
        break;
      default:
        break;
    }
  },
};
export default Logger;
