const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "./logger/log-error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
      maxSize: 5242880,
    }),
  ],
});

module.exports = { logger };
