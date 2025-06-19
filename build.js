// Build script for Cleverio PF100 Feeder Card using esbuild
import { build } from 'esbuild';

build({
  entryPoints: ['./www/cleverio-pf100-feeder-card/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'cleverio-pf100-feeder-card.bundle.js',
  target: ['es2020'],
  sourcemap: true,
  logLevel: 'info'
}).catch(() => process.exit(1));
