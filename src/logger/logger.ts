import { createLogger, format, transports, addColors } from "winston";
import stringify from "fast-safe-stringify";

const { combine, timestamp, printf, colorize, errors } = format;

const colors = {
  info: "bold white greenBG",
  debug: "bold black yellowBG",
  warn: "bold white magentaBG",
  error: "bold white redBG",
};

enum colorMessages {
  FgGreen = "\x1b[32m",
  FgBlue = "\x1b[34m",
  FgRed = "\x1b[31m",
  FgYellow = "\x1b[33m",
  FgWhite = "\x1b[37m",
}
enum statusMessages {
  "success" = "FgGreen",
  "redirection" = "FgBlue",
  "clientError" = "FgRed",
  "serverError" = "FgYellow",
}

addColors(colors);

function replaceColorInMessage(message: string) {
  const numberPattern = /\d+/g;

  const numbersArray = message.match(numberPattern);
  if (!numbersArray) {
    return message;
  }
  numbersArray.forEach((numberString) => {
    const number = parseInt(numberString);
    if (number >= 200 && number < 299) {
      message = message.replace(
        `${number}`,
        `${colorMessages[statusMessages["success"]]}${number}${
          colorMessages["FgWhite"]
        }`
      );
    } else if (number >= 300 && number < 399) {
      message = message.replace(
        `${number}`,
        `${colorMessages[statusMessages["redirection"]]}${number}${
          colorMessages["FgWhite"]
        }`
      );
    } else if (number >= 400 && number < 499) {
      message = message.replace(
        `${number}`,
        `${colorMessages[statusMessages["clientError"]]}${number}${
          colorMessages["FgWhite"]
        }`
      );
    } else if (number >= 500 && number < 599) {
      message = message.replace(
        `${number}`,
        `${colorMessages[statusMessages["serverError"]]}${number}${
          colorMessages["FgWhite"]
        }`
      );
    }
  });
  return message;
}

const replacer = (_key: string, value: any) => {
  // Remove the circular structure
  if (value === "[Circular]") {
    return;
  }
  return value;
};

const prettyJSONFormat = format((info) => {
  if (info.message.constructor === Object) {
    const spacer = info.spacer || 4;
    // @ts-ignore
    info.message = `\n${stringify(info.message, replacer, spacer)}`;
  }
  return info;
});

const debugFormat = printf(({ level, message, timestamp, stack }) => {
  return `${level} ${timestamp} \n\t${replaceColorInMessage(message)}${
    stack ? `\n\n\t${stack}` : ""
  }`;
});

const upperCaseLevelFormat = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

const yellFormat = format((info) => {
  if (info.yell) {
    info.message = info.message.toUpperCase();
  }
  return info;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    errors({ stack: true }),
    upperCaseLevelFormat(),
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    yellFormat(),
    prettyJSONFormat(),
    debugFormat
  ),
  defaultMeta: { api: "contract-api" },
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
});
