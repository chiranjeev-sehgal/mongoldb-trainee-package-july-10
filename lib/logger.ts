export type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name?: string;
    message?: string;
  };
}

function writeLog(entry: LogEntry): void {
  const serialized = JSON.stringify(entry);
  if (entry.level === 'error') {
    console.error(serialized);
    return;
  }

  console.log(serialized);
}

export const logger = {
  info(message: string, context?: Record<string, unknown>): void {
    writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context
    });
  },
  warn(message: string, context?: Record<string, unknown>): void {
    writeLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context
    });
  },
  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message
            }
          : undefined
    });
  }
};
