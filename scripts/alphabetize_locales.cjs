const fs = require('fs');
const path = require('path');

function sortObject(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const sorted = {};
  Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => {
      sorted[key] = sortObject(obj[key]);
    });
  return sorted;
}

const localesDir = path.join(__dirname, '..', 'app', 'i18n', 'locales');
const files = ['en.json', 'fr.json'];

files.forEach((file) => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`Sorting ${file}...`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const sortedContent = sortObject(content);
    fs.writeFileSync(filePath, JSON.stringify(sortedContent, null, 2) + '\n', 'utf8');
    console.log(`Finished sorting ${file}.`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});
