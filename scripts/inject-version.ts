import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = pkg.version;

// README.md — remplace uniquement la ligne MVP version
let readme = readFileSync('README.md', 'utf-8');
readme = readme.replace(/MVP v\d+\.\d+\.\d+/g, `MVP v${version}`);
writeFileSync('README.md', readme);

console.log(`✓ README.md updated to v${version}`);