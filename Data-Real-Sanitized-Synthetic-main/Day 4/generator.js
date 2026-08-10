const fs = require('fs');
const path = require('path');

const ALLOWED_LABELS = new Set(['save_memory', 'set_timer']);

const THE_SCHEMA = {
  type: 'object',
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          label: { type: 'string' }
        },
        required: ['text', 'label']
      }
    }
  },
  required: ['rows']
};

const CANDIDATE_ROWS = [
  // save_memory (22 rows)
  { id: 'syn-01', text: 'remember my locker code is 4417', label: 'save_memory', lang: 'en' },
  { id: 'syn-02', text: 'save that my passport expires in March', label: 'save_memory', lang: 'en' },
  { id: 'syn-03', text: 'note down that the wifi password is sunflower', label: 'save_memory', lang: 'en' },
  { id: 'syn-04', text: 'Remember my locker code is 4417', label: 'save_memory', lang: 'en' },
  { id: 'syn-05', text: 'log that the garage entry code is 4492', label: 'save_memory', lang: 'en' },
  { id: 'syn-06', text: 'save my flight confirmation number AB123', label: 'save_memory', lang: 'en' },
  { id: 'syn-07', text: 'merk dir, ich parke auf Ebene 3 (= remember I parked on level 3)', label: 'save_memory', lang: 'de' },
  { id: 'syn-08', text: 'Erinnere mich an die PIN 9921 (= remember my PIN 9921)', label: 'save_memory', lang: 'de' },
  { id: 'syn-09', text: 'garde en mémoire que mon code est 1234 (= keep in memory that my code is 1234)', label: 'save_memory', lang: 'fr' },
  { id: 'syn-10', text: '   ', label: 'save_memory', lang: 'en' },
  { id: 'syn-11', text: 'remind me to buy groceries at 5pm', label: 'create_task', lang: 'en' },
  { id: 'syn-12', text: "remember that Dr Weber's office is on 4th floor", label: 'save_memory', lang: 'en' },
  { id: 'syn-13', text: 'store my passport in the drawer', label: 'save_memory', lang: 'en' },
  { id: 'syn-14', text: "remember my dog's medication is 2 pills daily", label: 'save_memory', lang: 'en' },
  { id: 'syn-15', text: 'guarda en memoria que la clave es 8877 (= save in memory key is 8877)', label: 'save_memory', lang: 'es' },
  { id: 'syn-16', text: 'save that my license plate is ZH 49201', label: 'save_memory', lang: 'en' },
  { id: 'syn-17', text: 'note that the gate code is 9012', label: 'save_memory', lang: 'en' },
  { id: 'syn-18', text: 'Note that the gate code is 9012', label: 'save_memory', lang: 'en' },
  { id: 'syn-19', text: 'save that my passport expires in March', label: 'save_memory', lang: 'en' },
  { id: 'syn-20', text: 'remind me to save my file tomorrow', label: 'create_task', lang: 'en' },
  { id: 'syn-21', text: 'keep in mind my blood type is O positive', label: 'save_memory', lang: 'en' },
  { id: 'syn-22', text: "save my doctor's phone number as +41442111111", label: 'save_memory', lang: 'en' },

  // set_timer (22 rows)
  { id: 'syn-23', text: 'set a timer for 15 minutes', label: 'set_timer', lang: 'en' },
  { id: 'syn-24', text: 'timer 10 minutes', label: 'set_timer', lang: 'en' },
  { id: 'syn-25', text: 'Set a timer for 15 minutes', label: 'set_timer', lang: 'en' },
  { id: 'syn-26', text: 'set a 45 minute countdown for pizza', label: 'set_timer', lang: 'en' },
  { id: 'syn-27', text: 'stoppuhr auf 5 minuten stellen (= set stopwatch to 5 minutes)', label: 'set_timer', lang: 'de' },
  { id: 'syn-28', text: 'stelle einen timer für 20 minuten (= set a timer for 20 minutes)', label: 'set_timer', lang: 'de' },
  { id: 'syn-29', text: 'met un minuteur de 10 minutes (= set a 10 minute timer)', label: 'set_timer', lang: 'fr' },
  { id: 'syn-30', text: 'pon un temporizador de 30 minutos (= set a 30 minute timer)', label: 'set_timer', lang: 'es' },
  { id: 'syn-31', text: 'in 10 minutes remind me to stir soup', label: 'create_task', lang: 'en' },
  { id: 'syn-32', text: '   ', label: 'set_timer', lang: 'en' },
  { id: 'syn-33', text: 'timer 25 minutes for baking', label: 'set_timer', lang: 'en' },
  { id: 'syn-34', text: 'start a 5 minute timer', label: 'set_timer', lang: 'en' },
  { id: 'syn-35', text: 'set timer for 1 hour', label: 'set_timer', lang: 'en' },
  { id: 'syn-36', text: 'Start a 5 minute timer', label: 'set_timer', lang: 'en' },
  { id: 'syn-37', text: 'remind me to check oven in 20 minutes', label: 'create_task', lang: 'en' },
  { id: 'syn-38', text: 'set a timer for 8 minutes for eggs', label: 'set_timer', lang: 'en' },
  { id: 'syn-39', text: 'countdown 12 minutes', label: 'set_timer', lang: 'en' },
  { id: 'syn-40', text: "what's the weather like tomorrow", label: 'answer_question', lang: 'en' },
  { id: 'syn-41', text: 'set a 30 minute timer', label: 'set_timer', lang: 'en' },
  { id: 'syn-42', text: '', label: 'set_timer', lang: 'en' },
  { id: 'syn-43', text: 'timer for 15 minutes', label: 'set_timer', lang: 'en' },
  { id: 'syn-44', text: 'start a countdown of 3 minutes', label: 'set_timer', lang: 'en' }
];

function filterGenerations(candidates, allowedLabels) {
  const seen = new Set();
  const keptRows = [];
  const droppedRows = [];
  const tally = {
    kept: 0,
    dropped_off_label: 0,
    dropped_blank: 0,
    dropped_dup: 0
  };
  const perClassKept = {};

  for (const row of candidates) {
    const label = row.label;
    const rawText = row.text || '';
    const normalizedText = rawText.trim();

    if (!allowedLabels.has(label)) {
      tally.dropped_off_label++;
      droppedRows.push({ ...row, verdict: 'dropped_off_label' });
      continue;
    }

    if (!normalizedText) {
      tally.dropped_blank++;
      droppedRows.push({ ...row, verdict: 'dropped_blank' });
      continue;
    }

    const dedupKey = `${normalizedText.toLowerCase()}::${label}`;
    if (seen.has(dedupKey)) {
      tally.dropped_dup++;
      droppedRows.push({ ...row, verdict: 'dropped_dup' });
      continue;
    }

    seen.add(dedupKey);
    tally.kept++;
    perClassKept[label] = (perClassKept[label] || 0) + 1;
    keptRows.push({ ...row, verdict: 'kept' });
  }

  return { keptRows, droppedRows, tally, perClassKept };
}

function main() {
  const day4Dir = __dirname;

  const candidatesCsvPath = path.join(day4Dir, 'synthetic_candidates.csv');
  const survivorsCsvPath = path.join(day4Dir, 'filtered_survivors.csv');

  const { keptRows, droppedRows, tally, perClassKept } = filterGenerations(CANDIDATE_ROWS, ALLOWED_LABELS);

  // Save candidates CSV
  const candidateHeader = 'id,text,label,lang\n';
  const candidateLines = CANDIDATE_ROWS.map(r => `${r.id},"${r.text.replace(/"/g, '""')}",${r.label},${r.lang}`).join('\n');
  fs.writeFileSync(candidatesCsvPath, candidateHeader + candidateLines, 'utf8');

  // Save survivors CSV
  const survivorHeader = 'id,text,label,lang,verdict\n';
  const survivorLines = keptRows.map(r => `${r.id},"${r.text.replace(/"/g, '""')}",${r.label},${r.lang},${r.verdict}`).join('\n');
  fs.writeFileSync(survivorsCsvPath, survivorHeader + survivorLines, 'utf8');

  console.log('=== Day 4 Synthetic Generation & Filtering Scoreboard ===');
  console.log(`Total Candidate Rows Generated: ${CANDIDATE_ROWS.length}`);
  console.log(`Kept Survivors: ${tally.kept}`);
  console.log(`Dropped Off-Label: ${tally.dropped_off_label}`);
  console.log(`Dropped Blank: ${tally.dropped_blank}`);
  console.log(`Dropped Duplicates: ${tally.dropped_dup}`);
  console.log('\nPer-Class Kept Counts:');
  for (const label of Object.keys(perClassKept).sort()) {
    console.log(`  - ${label}: ${perClassKept[label]} rows`);
  }
}


main();
