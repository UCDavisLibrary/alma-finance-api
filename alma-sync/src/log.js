export function log(level, message, data = undefined) {
  const entry = {
    level,
    message,
    service: 'alma-sync',
    timestamp: new Date().toISOString(),
  };

  if (data !== undefined) entry.data = data;
  console.log(JSON.stringify(entry));
}
