import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use provided version or default to 'dev' for local builds
const version = process.argv[2] || 'dev';

const now = new Date();
const buildDate = now.toISOString().split('T')[0];
const buildTime = now.toTimeString().split(' ')[0];

const versionFile = path.join(__dirname, '../src/version.ts');
const template = `export const VERSION = {
  release: '${version}',
  buildTime: '${buildTime}',
  buildDate: '${buildDate}',
};

export function getVersionString(): string {
  const prefix = VERSION.release === 'dev' ? '' : 'v';
  return \`\${prefix}\${VERSION.release} (\${VERSION.buildDate} \${VERSION.buildTime})\`;
}
`;

fs.writeFileSync(versionFile, template);
const prefix = version === 'dev' ? '' : 'v';
console.log(
  `✓ Version updated: ${prefix}${version} (${buildDate} ${buildTime})`,
);
