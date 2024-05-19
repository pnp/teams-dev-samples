import config from "../config";

export class Logger {

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


    static debug(message: string, ...optionalParams: any[]) {
      console.debug(`[DEBUG] ${this.sanitize(message)}`, ...optionalParams);
    }
  
    static info(message: string, ...optionalParams: any[]) {
      console.info(`[INFO] ${this.sanitize(message)}`, ...optionalParams);
    }
  
    static warn(message: string, ...optionalParams: any[]) {
      console.warn(`[WARN] ${this.sanitize(message)}`, ...optionalParams);
    }
  
    static error(message: string, ...optionalParams: any[]) {
      console.error(`[ERROR] ${this.sanitize(message)}`, ...optionalParams);
    }
  }

