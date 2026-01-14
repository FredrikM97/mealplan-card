import { readFileSync } from 'fs';
import { join } from 'path';

const file = join(process.cwd(), 'src/profiles/profiles.ts');
const content = readFileSync(file, 'utf8');

// Match manufacturer and models from profiles array
const profileRegex = /manufacturer:\s*'([^']+)',[^}]*models:\s*(\[[^\]]*\])/g;

const manufacturers = [];

let match;
while ((match = profileRegex.exec(content))) {
  const manufacturer = match[1];
  // Parse models array
  const modelsRaw = match[2];
  const models = modelsRaw
    .replace(/[\[\]'" ]/g, '')
    .split(',')
    .filter(Boolean);
  manufacturers.push({ manufacturer, models });
}

// Generate Markdown
let md = '## Supported Manufacturers\n\n';
manufacturers.forEach(({ manufacturer, models }) => {
  md += `- **${manufacturer}**`;
  if (models.length) {
    md += `\n  - Models: ${models.join(', ')}`;
  }
  md += '\n';
});

console.log(md.trimEnd());
