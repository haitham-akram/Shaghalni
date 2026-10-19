/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, '../messages/ar.json');
const enPath = path.join(__dirname, '../messages/en.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

const arKeys = getKeys(ar);
const enKeys = getKeys(en);

const arSet = new Set(arKeys);
const enSet = new Set(enKeys);

const missingInEn = arKeys.filter((k) => !enSet.has(k));
const missingInAr = enKeys.filter((k) => !arSet.has(k));

if (missingInEn.length > 0 || missingInAr.length > 0) {
  console.error('❌ i18n key mismatch found:');
  if (missingInEn.length > 0) {
    console.error(`Missing in English (${missingInEn.length}):\n `, missingInEn.join('\n  '));
  }
  if (missingInAr.length > 0) {
    console.error(`Missing in Arabic (${missingInAr.length}):\n `, missingInAr.join('\n  '));
  }
  process.exit(1);
} else {
  console.log(`✅ All ${arKeys.length} i18n keys match perfectly between ar.json and en.json.`);
  process.exit(0);
}
