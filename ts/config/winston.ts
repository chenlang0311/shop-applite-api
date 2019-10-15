import * as winston from "winston";
import * as moment from "moment";

const [Console, File] = [winston.transports.Console, winston.transports.File];
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

function timestamp() {
    return moment().format("YYYYMMDD HH:mm:ss");
}

export function config(logdir: string = 'logs') {
    return {
        transports: [
            new Console({
                level: "silly",
                timestamp: timestamp
            }),

            new File({
                json: false,
                filename: `${logdir}/debug.log`,
                name: "debug-file",
                maxFiles: 10,
                maxsize: 1024 * 1024 * 5,
                // zippedArchive: true, // 是否zipped
                level: "debug",
                tailable: true,
                timestamp: timestamp
            }),

            new File({
                json: false,
                filename: `${logdir}/info.log`,
                name: "info-file",
                maxFiles: 10,
                maxsize: 1024 * 1024 * 5,
                // zippedArchive: true,
                level: "info",
                tailable: true,
                timestamp: timestamp
            }),

            new File({
                json: false,
                filename: `${logdir}/warn.log`,
                name: "warn-file",
                maxFiles: 10,
                maxsize: 1024 * 1024 * 10,
                // zippedArchive: true,
                level: "warn",
                tailable: true,
                timestamp: timestamp
            })
        ],

        exceptionHandlers: [
            new File({
                filename: `${logdir}/exceptions.log`,
            })
        ]
    }
} 
