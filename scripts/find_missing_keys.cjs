const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'app', 'i18n', 'locales');
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
const fr = JSON.parse(fs.readFileSync(path.join(localesDir, 'fr.json'), 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = new Set(getKeys(en));
const frKeys = new Set(getKeys(fr));

console.log('--- Keys in EN but not in FR ---');
for (const key of enKeys) {
  if (!frKeys.has(key)) console.log(key);
}

console.log('\n--- Keys in FR but not in EN ---');
for (const key of frKeys) {
  if (!enKeys.has(key)) console.log(key);
}
