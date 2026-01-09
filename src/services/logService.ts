class LogService {
  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }

  info(message: string) {
    console.log(`[INFO] ${message}`);
  }
}

export const logService = new LogService();
