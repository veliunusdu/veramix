type LogLevel = 'info' | 'warn' | 'error'

type LogMeta = Record<string, unknown>

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return { value: error }
}

function write(level: LogLevel, message: string, meta?: LogMeta) {
  const payload = {
    time: new Date().toISOString(),
    level,
    message,
    ...(meta ?? {}),
  }

  if (level === 'error') {
    console.error(payload)
    return
  }

  if (level === 'warn') {
    console.warn(payload)
    return
  }

  console.log(payload)
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    write('info', message, meta)
  },
  warn(message: string, meta?: LogMeta) {
    write('warn', message, meta)
  },
  error(message: string, error?: unknown, meta?: LogMeta) {
    write('error', message, {
      ...(meta ?? {}),
      ...(error ? { error: serializeError(error) } : {}),
    })
  },
}
