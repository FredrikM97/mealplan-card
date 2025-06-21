import { build } from 'esbuild';

build({
  entryPoints: ['./src/cleverio/main.ts'], // Use .ts if you write TypeScript
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'cleverio-pf100-feeder-card/cleverio-pf100-feeder-card.bundle.js',
  target: ['es2020'],
  sourcemap: true,
  logLevel: 'info'
}).catch(() => process.exit(1));