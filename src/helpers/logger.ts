import * as express from 'express';
import * as expressWinston from 'express-winston';
const winston = require('winston'); // for transports.Console
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

export class Logger {

    private static logger;
    private static _errorLogger;
    private static logDirectory = path.join(process.cwd(), 'logs');

    private static CreateLogFolderIfNotExists() {
        // ensure log directory exists
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory);
        }
    }

    private static SetLogger(app: express.Express) {
        this.logger = new winston.Logger({
            transports: [
                new DailyRotateFile({
                    filename: path.join(Logger.logDirectory, "%DATE%.log"),
                    datePattern: 'YYYY-MM-DD',
                    prepend: true,
                    localTime: true,
                    level: 'verbose'
                })
            ],
            exitOnError: false
        });

    }

    public static configureLogger(app: express.Express) {
        this.CreateLogFolderIfNotExists();
        this.SetLogger(app);
    }


    private static GetValue(value: any) {
        if (typeof value === "string") {
            return value;
        } else {
            return JSON.stringify(value);
        }
    }

    public static debug(value: any) {
        if (this.logger) {
            this.logger.log('debug', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

    public static error(value: any) {
        if (this.logger) {
            this.logger.log('error', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

    public static warn(value: any) {
        if (this.logger) {
            this._errorLogger.log('warn', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

    public static info(value: any) {
        if (this.logger) {
            this.logger.log('info', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

}
