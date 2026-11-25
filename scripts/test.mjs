import assert from 'node:assert';
import {
  holidaysFor,
  searchHolidays,
  nextHolidays,
  availableStates,
  normalizeState,
} from '../lib/holiday.js';

let passed = 0;
function ok(name, fn) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

async function okAsync(name, fn) {
  await fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log('Data tests:');

ok('availableStates includes central and three states', () => {
  const s = availableStates();
  assert.ok(s.includes('central'));
  for (const st of ['Maharashtra', 'Karnataka', 'Tamil Nadu']) {
    assert.ok(s.includes(st), `expected ${st} in ${s.join(', ')}`);
  }
});

ok('normalizeState is case-insensitive and maps central/federal', () => {
  assert.strictEqual(normalizeState('maharashtra'), 'Maharashtra');
  assert.strictEqual(normalizeState('  Central '), 'central');
  assert.strictEqual(normalizeState('federal'), 'central');
});

ok('central 2025 returns the national holidays', () => {
  const data = holidaysFor('2025', 'central');
  assert.ok(Array.isArray(data), 'expected an array');
  assert.ok(data.length >= 10, `expected >=10 central holidays, got ${data.length}`);
  const republic = data.find((h) => h.name === 'Republic Day');
  assert.ok(republic, 'expected a Republic Day entry');
  assert.strictEqual(republic.date, '2025-01-26');
  assert.strictEqual(republic.dayOfWeek, 'Sunday');
  assert.strictEqual(republic.type, 'Central');
});

ok('Maharashtra 2024 includes Ganeshotsav and Maharashtra Day', () => {
  const data = holidaysFor('2024', 'Maharashtra');
  const names = data.map((h) => h.name);
  assert.ok(names.includes('Ganeshotsav (Prathamastami)'), 'expected Ganeshotsav');
  assert.ok(names.includes('Maharashtra Day'), 'expected Maharashtra Day');
  const ganesh = data.find((h) => h.name.includes('Ganeshotsav'));
  assert.strictEqual(ganesh.date, '2024-09-16');
  assert.strictEqual(ganesh.type, 'Gazetted');
});

ok('central holidays also appear when querying a state', () => {
  const data = holidaysFor('2025', 'Karnataka');
  const names = data.map((h) => h.name);
  assert.ok(names.includes('Republic Day'), 'expected Republic Day for Karnataka too');
});

ok('unknown state returns an error', () => {
  const data = holidaysFor('2025', 'Atlantis');
  assert.ok(data.error, 'expected an error');
  assert.match(data.error, /Unknown state/);
});

ok('invalid year returns an error', () => {
  const data = holidaysFor('24', 'central');
  assert.ok(data.error, 'expected an error');
  assert.match(data.error, /Invalid year/);
});

console.log('\nSearch tests:');

ok('keyword search finds Diwali in 2025', () => {
  const data = searchHolidays('Diwali', 'central');
  assert.ok(Array.isArray(data), 'expected an array');
  assert.ok(data.length >= 1, 'expected at least one Diwali');
  assert.ok(data.every((h) => h.name.includes('Diwali')), 'all matches should be Diwali');
  const d = data.find((h) => h.date.startsWith('2025'));
  assert.strictEqual(d.date, '2025-10-21');
});

ok('keyword search is case-insensitive', () => {
  const a = searchHolidays('republic day', 'central');
  const b = searchHolidays('REPUBLIC DAY', 'central');
  assert.strictEqual(a.length, b.length);
  assert.ok(a.length >= 1);
});

ok('month search returns holidays in that month', () => {
  const data = searchHolidays('8', 'central'); // August
  assert.ok(Array.isArray(data), 'expected an array');
  assert.ok(data.length >= 1, 'expected August holidays');
  assert.ok(data.every((h) => h.date.slice(5, 7) === '08'), 'all should be August');
});

ok('empty query returns an error', () => {
  const data = searchHolidays('   ', 'central');
  assert.ok(data.error, 'expected an error');
});

console.log('\nNext-holiday tests:');

ok('next_holiday returns the next 5 from a fixed today', () => {
  const today = new Date(2025, 0, 10); // 2025-01-10
  const data = nextHolidays('central', 5, today);
  assert.ok(Array.isArray(data), 'expected an array');
  assert.strictEqual(data.length, 5, 'expected 5 holidays');
  // First entry must be on or after 2025-01-10
  assert.ok(new Date(data[0].date) >= new Date(2025, 0, 10), 'first must be >= today');
  // Should include Republic Day (2025-01-26)
  assert.ok(data.some((h) => h.date === '2025-01-26'), 'expected Republic Day');
});

ok('next_holiday respects count', () => {
  const today = new Date(2025, 0, 1);
  const data = nextHolidays('central', 3, today);
  assert.strictEqual(data.length, 3);
});

ok('next_holiday unknown state returns an error', () => {
  const data = nextHolidays('Atlantis', 5, new Date());
  assert.ok(data.error, 'expected an error');
});

console.log(`\n${passed} passed.`);
