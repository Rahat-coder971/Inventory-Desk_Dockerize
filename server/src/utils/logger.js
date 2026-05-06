function formatMeta(meta) {
  if (!meta || Object.keys(meta).length === 0) {
    return '';
  }

  return ` ${JSON.stringify(meta)}`;
}

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level}] ${message}${formatMeta(meta)}`;

  if (level === 'ERROR') {
    console.error(line);
    return;
  }

  if (level === 'WARN') {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  info(message, meta) {
    log('INFO', message, meta);
  },
  warn(message, meta) {
    log('WARN', message, meta);
  },
  error(message, meta) {
    log('ERROR', message, meta);
  },
};

export function maskMongoUri(uri = '') {
  return uri.replace(/:\/\/([^:@]+):([^@]+)@/, '://$1:****@');
}
