/**
 * Day 3 — Cohen's Kappa & Inter-Annotator Agreement Measurement
 * Build Your Own AI Router (Data: Real, Sanitized, Synthetic)
 *
 * Implements observed agreement (po), expected chance agreement (pe),
 * and Cohen's kappa (κ) over the 20-row double-labelled slice.
 */

const fs = require('fs');
const path = require('path');

function getKappaBand(kappa) {
  if (kappa < 0.20) return "Poor (barely better than chance)";
  if (kappa < 0.40) return "Fair (weak guideline, needs work)";
  if (kappa < 0.60) return "Moderate (usable but shaky)";
  if (kappa < 0.80) return "Substantial (solid, guideline mostly works)";
  return "Near-perfect (trustworthy benchmark quality)";
}

function cohenKappa(labelsA, labelsB) {
  const n = labelsA.length;
  if (n === 0 || n !== labelsB.length) {
    throw new Error("Input arrays must be non-empty and of equal length.");
  }

  // 1. Observed agreement (po)
  let agreeCount = 0;
  for (let i = 0; i < n; i++) {
    if (labelsA[i] === labelsB[i]) {
      agreeCount++;
    }
  }
  const po = agreeCount / n;

  // 2. Expected chance agreement (pe)
  const labelCountsA = {};
  const labelCountsB = {};
  const allLabels = new Set([...labelsA, ...labelsB]);

  for (let i = 0; i < n; i++) {
    labelCountsA[labelsA[i]] = (labelCountsA[labelsA[i]] || 0) + 1;
    labelCountsB[labelsB[i]] = (labelCountsB[labelsB[i]] || 0) + 1;
  }

  let pe = 0.0;
  for (const label of allLabels) {
    const pA = (labelCountsA[label] || 0) / n;
    const pB = (labelCountsB[label] || 0) / n;
    pe += pA * pB;
  }

  // 3. Cohen's Kappa
  const kappa = pe === 1.0 ? 1.0 : (po - pe) / (1.0 - pe);

  return { agreeCount, po, pe, kappa };
}

function parseCSV(content) {
  const lines = content.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const header = lines[0].split(',');
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    // Simple CSV parser handling our specific format
    rows.push({
      id: parts[0],
      sanitised_text: parts.slice(1, parts.length - 2).join(','),
      pass1_label: parts[parts.length - 2],
      pass2_label: parts[parts.length - 1]
    });
  }
  return rows;
}

function main() {
  const slicePath = path.join(__dirname, 'double_labelled_slice.csv');

  if (!fs.existsSync(slicePath)) {
    console.error(`[ERROR] Could not find ${slicePath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(slicePath, 'utf8');
  const rows = parseCSV(csvContent);

  const labelsA = rows.map(r => r.pass1_label);
  const labelsB = rows.map(r => r.pass2_label);

  const { agreeCount, po, pe, kappa } = cohenKappa(labelsA, labelsB);
  const band = getKappaBand(kappa);

  console.log("=" .repeat(65));
  console.log("      DAY 3: INTER-ANNOTATOR AGREEMENT REPORT");
  console.log("=" .repeat(65));
  console.log(` Total Rows Evaluated   : ${rows.length}`);
  console.log(` Exact Matches          : ${agreeCount} / ${rows.length}`);
  console.log(` Observed Agreement (po): ${po.toFixed(3)} (${(po * 100).toFixed(1)}%)`);
  console.log(` Chance Agreement   (pe): ${pe.toFixed(3)} (${(pe * 100).toFixed(1)}%)`);
  console.log(` Cohen's Kappa      (κ) : ${kappa.toFixed(3)}`);
  console.log(` Agreement Band         : ${band}`);
  console.log("-" .repeat(65));

  const disagreements = rows.filter(r => r.pass1_label !== r.pass2_label);
  console.log(`\nDisagreements Found (${disagreements.length} rows):`);
  disagreements.forEach(r => {
    console.log(` Row ID ${r.id}: "${r.sanitised_text}"`);
    console.log(`   - Pass 1 (Annotator A): ${r.pass1_label}`);
    console.log(`   - Pass 2 (Annotator B): ${r.pass2_label}`);
  });

  console.log("=" .repeat(65));
}

main();
