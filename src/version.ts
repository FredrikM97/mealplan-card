export const VERSION = {
  release: '555',
  buildTime: '17:55:10',
  buildDate: '2026-01-24',
};

export function getVersionString(): string {
  const prefix = VERSION.release === 'dev' ? '' : 'v';
  return `${prefix}${VERSION.release} (${VERSION.buildDate} ${VERSION.buildTime})`;
}
