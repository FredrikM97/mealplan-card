export const VERSION = {
  release: 'dev',
};

export function getVersionString(): string {
  const now = new Date();
  const buildDate = now.toISOString().split('T')[0];
  const buildTime = now.toTimeString().split(' ')[0];
  const prefix = VERSION.release === 'dev' ? '' : 'v';
  return `${prefix}${VERSION.release} (${buildDate} ${buildTime})`;
}
