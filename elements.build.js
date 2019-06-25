const fs = require('fs-extra');
const concat = require('concat');

const sourceDistribution = 'dist/local';
const targetDistribution = 'dist/elements';

const outputJS = targetDistribution + '/sparql-manager.js';
const outputCSS = targetDistribution + '/sparql-manager.css';
const html = 'index.html';

const jsES5Files = [
  'env.js',
  '0-es5.js',
  'main-es5.js',
  '2-es5.js',
  '3-es5.js',
  '4-es5.js',
  '5-es5.js',
  'scripts.js',
];

const jsES2015Files = [
  'env.js',
  '0-es2015.js',
  '2-es2015.js',
  '3-es2015.js',
  '4-es2015.js',
  '5-es2015.js',
  'scripts.js',
  'main-es2015.js',
];

(async function build() {
  const files = fs.readdirSync(sourceDistribution);

  const jsFiles = jsES2015Files
    .map(value => `${sourceDistribution}/${value}`);
  const cssFiles = files
    .filter(value => value.endsWith('css'))
    .map(value => `${sourceDistribution}/${value}`);

  await fs.ensureDir(targetDistribution);
  await fs.copy(`elements/${html}`, `${targetDistribution}/${html}`);
  await concat(jsFiles, outputJS);
  await concat(cssFiles, outputCSS);
})();
