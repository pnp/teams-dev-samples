import config from "../config";

/**
 * The Logger class provides logging functionality for the application.
 */
export class Logger {

  /**
   * Sanitizes the message by replacing any secrets with '***'.
   * @param message - The message to sanitize.
   * @returns The sanitized message.
   */
  private static sanitize(message: string): string {
    let sanitizedMessage = message;
    // Assuming config contains a secrets object with key-value pairs
    for (const [key, value] of Object.entries(config)) {
      const secret = value.toString();
      if (secret) {
        sanitizedMessage = sanitizedMessage.replace(new RegExp(secret, 'g'), '***');
      }
    }
    return sanitizedMessage;
  }

  /**
   * Logs a debug message.
   * @param message - The debug message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  static debug(message: string, ...optionalParams: any[]) {
    console.debug(`[DEBUG] ${this.sanitize(message)}`, ...optionalParams);
  }

  /**
   * Logs an info message.
   * @param message - The info message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  static info(message: string, ...optionalParams: any[]) {
    console.info(`[INFO] ${this.sanitize(message)}`, ...optionalParams);
  }

  /**
   * Logs a warning message.
   * @param message - The warning message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  static warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN] ${this.sanitize(message)}`, ...optionalParams);
  }

  /**
   * Logs an error message.
   * @param message - The error message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  static error(message: string, ...optionalParams: any[]) {
    console.error(`[ERROR] ${this.sanitize(message)}`, ...optionalParams);
  }
}

