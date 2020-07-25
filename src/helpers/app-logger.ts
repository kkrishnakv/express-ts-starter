import { createLogger, transports, Logger, format } from "winston";
import path = require("path");
import fs = require("fs");
import "winston-daily-rotate-file";

export class AppLogger {
  private static logger: Logger;
  private static logDirectory = path.join(process.cwd(), "logs");

  private static CreateLogFolderIfNotExists() {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!fs.existsSync(this.logDirectory)) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.mkdirSync(this.logDirectory);
    }
  }

  private static SetLogger() {
    const logFormat = format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    });
    this.logger = createLogger({
      format: format.combine(format.json(), format.timestamp(), logFormat),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          filename: path.join(AppLogger.logDirectory, "starter-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxSize: "1g",
          level: "verbose",
        }),
      ],
      exitOnError: false,
    });
  }

  public static configureLogger() {
    this.CreateLogFolderIfNotExists();
    this.SetLogger();
  }

  private static GetValue(name: string, value: any) {
    if (typeof value === "string") {
      return `${name}-  ${value}`;
    } else {
      return `${name}-${JSON.stringify(value)}`;
    }
  }

  public static debug(name: string, value: any) {
    this.logger.log("debug", this.GetValue(name, value));
  }

  public static error(name: string, value: any) {
    this.logger.log("error", this.GetValue(name, value));
  }

  public static warn(name: string, value: any) {
    this.logger.log("warn", this.GetValue(name, value));
  }

  public static info(name: string, value: any) {
    this.logger.log("info", this.GetValue(name, value));
  }
}
