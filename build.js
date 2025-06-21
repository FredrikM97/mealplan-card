// Build script for Cleverio PF100 Feeder Card using esbuild
import { build } from 'esbuild';

build({
  entryPoints: ['./src/cleverio/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'cleverio-pf100-feeder-card.bundle.js',
  target: ['es2020'],
  sourcemap: true,
  logLevel: 'info'
}).catch(() => process.exit(1));
