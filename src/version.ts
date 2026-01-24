export const VERSION = {
  release: 'dev',
  buildTime: '17:59:20',
  buildDate: '2026-01-24',
};

export function getVersionString(): string {
  const prefix = VERSION.release === 'dev' ? '' : 'v';
  return `${prefix}${VERSION.release} (${VERSION.buildDate} ${VERSION.buildTime})`;
}
