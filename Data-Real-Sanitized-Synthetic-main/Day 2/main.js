const fs = require('fs');
const path = require('path');

function normalise(text) {
    if (!text) return "";
    // 1. collapse runs of whitespace
    let collapsed = text.split(/\s+/).join(' ');
    // 2. lowercase
    let lowered = collapsed.toLowerCase();
    // 3. strip outer punctuation and surrounding whitespace
    // ASCII punctuation regex: ^[!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]+|[!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]+$
    let canonical = lowered.replace(/^[!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~\s]+|[!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~\s]+$/g, '');
    return canonical;
}

function relabelRow(rawText, originalIntent) {
    const textLower = rawText.toLowerCase();

    if (textLower.includes("remind me to call")) {
        return { intent: "create_task", isAmbiguous: false, clause: "Clause 2.1 Tie-Breaker (Task vs Call)" };
    }
    if (textLower.includes("in 10 minutes remind me") || textLower.includes("in 10 mins remind")) {
        return { intent: "create_task", isAmbiguous: false, clause: "Clause 2.5 Tie-Breaker (Task vs Timer)" };
    }
    if (textLower.includes("text mom") || textLower.includes("send a text message")) {
        return { intent: "out_of_scope", isAmbiguous: false, clause: "Clause 2.6 Tie-Breaker (Unsupported channel)" };
    }

    if (["create_task", "place_call", "answer_question", "save_memory", "set_timer"].includes(originalIntent)) {
        if (originalIntent === "place_call" && (textLower.includes("schedule") || textLower.includes("remind"))) {
            return { intent: "create_task", isAmbiguous: false, clause: "Clause 2.1 (Scheduled Call -> Task)" };
        }
        return { intent: originalIntent, isAmbiguous: false, clause: `Direct match (${originalIntent})` };
    }

    if (["deliver_message", "finance_summary"].includes(originalIntent)) {
        return { intent: "out_of_scope", isAmbiguous: false, clause: `Clause 2.6 (${originalIntent} -> out_of_scope)` };
    }

    return { intent: "out_of_scope", isAmbiguous: true, clause: "Flagged for Day 3 Adjudication" };
}

function parseCSVLine(line) {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            let val = line.substring(start, i).trim();
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1).replace(/""/g, '"');
            }
            result.push(val);
            start = i + 1;
        }
    }
    let val = line.substring(start).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"');
    }
    result.push(val);
    return result;
}

function runPipeline() {
    const day1CsvPath = path.join(__dirname, "..", "Day 1", "sanitised_sample.csv");
    const outputGoldCsv = path.join(__dirname, "clean_gold.csv");
    const outputAmbiguousCsv = path.join(__dirname, "ambiguous_rows.csv");

    const rawRows = [];

    if (fs.existsSync(day1CsvPath)) {
        const fileContent = fs.readFileSync(day1CsvPath, "utf-8");
        const lines = fileContent.split(/\r?\n/).filter(l => l.trim().length > 0);
        const headers = parseCSVLine(lines[0]);

        for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVLine(lines[i]);
            if (cols.length >= 3) {
                rawRows.push({
                    id: cols[0],
                    sanitised_text: cols[1],
                    original_intent: cols[2],
                    language: cols[3] || "en"
                });
            }
        }
    }

    const driftVariants = [
        { id: "31", sanitised_text: "Call <NAME> at <PHONE>.", original_intent: "place_call", language: "en" },
        { id: "32", sanitised_text: "call <NAME> at <PHONE>!!", original_intent: "place_call", language: "en" },
        { id: "33", sanitised_text: "CALL <NAME> AT <PHONE>", original_intent: "place_call", language: "en" },
        { id: "34", sanitised_text: "remind me to call the dentist", original_intent: "place_call", language: "en" },
        { id: "35", sanitised_text: "text mom I'm running late", original_intent: "deliver_message", language: "en" },
        { id: "36", sanitised_text: "in 10 minutes remind me to stir the soup", original_intent: "set_timer", language: "en" },
        { id: "37", sanitised_text: "log that the garage entry code is 4492", original_intent: "save_memory", language: "en" },
        { id: "38", sanitised_text: "call doctor Office on +<PHONE>567 to reschedule", original_intent: "place_call", language: "de" },
        { id: "39", sanitised_text: "remind me to call <NAME> at <EMAIL> tomorrow.", original_intent: "create_task", language: "en" },
        { id: "40", sanitised_text: "what is the current temperature in zurich?", original_intent: "answer_question", language: "en" },
        { id: "41", sanitised_text: "maybe schedule or call <NAME> depending on status", original_intent: "ambiguous", language: "en" },
    ];

    const allRaw = [...rawRows, ...driftVariants];

    const processedRows = [];
    const ambiguousRows = [];

    for (const item of allRaw) {
        const relabeled = relabelRow(item.sanitised_text, item.original_intent);
        const rowDict = {
            id: item.id,
            sanitised_text: item.sanitised_text,
            guideline_label: relabeled.intent,
            clause_applied: relabeled.clause,
            language: item.language
        };

        if (relabeled.isAmbiguous || item.original_intent === "ambiguous") {
            ambiguousRows.push(rowDict);
        } else {
            processedRows.push(rowDict);
        }
    }

    const seenKeys = new Set();
    const keptRows = [];
    const droppedRows = [];

    for (const r of processedRows) {
        const normKey = normalise(r.sanitised_text);
        if (seenKeys.has(normKey)) {
            droppedRows.push(r);
        } else {
            seenKeys.add(normKey);
            r.normalised_key = normKey;
            keptRows.push(r);
        }
    }

    function escapeCSV(val) {
        if (val === undefined || val === null) return '""';
        let str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    let goldCsvContent = "id,sanitised_text,normalised_key,guideline_label,clause_applied,language\n";
    for (const r of keptRows) {
        goldCsvContent += `${escapeCSV(r.id)},${escapeCSV(r.sanitised_text)},${escapeCSV(r.normalised_key)},${escapeCSV(r.guideline_label)},${escapeCSV(r.clause_applied)},${escapeCSV(r.language)}\n`;
    }
    fs.writeFileSync(outputGoldCsv, goldCsvContent, "utf-8");

    let ambCsvContent = "id,sanitised_text,guideline_label,clause_applied,language\n";
    for (const r of ambiguousRows) {
        ambCsvContent += `${escapeCSV(r.id)},${escapeCSV(r.sanitised_text)},${escapeCSV(r.guideline_label)},${escapeCSV(r.clause_applied)},${escapeCSV(r.language)}\n`;
    }
    fs.writeFileSync(outputAmbiguousCsv, ambCsvContent, "utf-8");

    const perClassCounts = {};
    for (const r of keptRows) {
        perClassCounts[r.guideline_label] = (perClassCounts[r.guideline_label] || 0) + 1;
    }

    console.log("=" .repeat(65));
    console.log(" DAY 2 · LABELLING DISCIPLINE & DEDUP FUNNEL AUDIT REPORT");
    console.log("=" .repeat(65));
    console.log(`Total Raw Rows Processed    : ${allRaw.length}`);
    console.log(`Near-Duplicates Dropped     : ${droppedRows.length}`);
    console.log(`Flagged Ambiguous Rows      : ${ambiguousRows.length}`);
    console.log(`Clean Labelled Gold Rows    : ${keptRows.length}`);
    console.log("-" .repeat(65));
    console.log("Per-Class Counts (Clean Gold Corpus):");
    Object.keys(perClassCounts).sort().forEach(intent => {
        console.log(`  - ${intent.padEnd(18)}: ${perClassCounts[intent]}`);
    });
    console.log("-" .repeat(65));
    console.log(`✓ Saved clean gold dataset to: clean_gold.csv`);
    console.log(`✓ Saved ambiguous cases to  : ambiguous_rows.csv`);
    console.log("=" .repeat(65));
}

runPipeline();
