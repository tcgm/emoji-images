// generateOpenmojiSequences.js
// Node.js script to convert emoji-sequences.txt and supplement.txt to openmojiSequences.ts
const fs = require('fs');
const path = require('path');

function parseEmojiSequences(text) {
    const lines = text.split(/\r?\n/);
    const codepoints = [];
    for (const line of lines) {
        if (line.trim().startsWith('#') || !line.trim()) continue;
        // Range, e.g. 231A..231B
        const rangeMatch = line.match(/^([0-9A-Fa-f]+)\.\.([0-9A-Fa-f]+)\s*;/);
        if (rangeMatch) {
            const start = parseInt(rangeMatch[1], 16);
            const end = parseInt(rangeMatch[2], 16);
            for (let cp = start; cp <= end; cp++) {
                codepoints.push([cp.toString(16).toUpperCase()]);
            }
            continue;
        }
        // Sequence, e.g. 1F468 200D 1F3A8 ; ...
        const match = line.match(/^([0-9A-Fa-f ]+)\s*;/);
        if (match) {
            const cps = match[1].trim().split(/\s+/);
            codepoints.push(cps.map(cp => cp.toUpperCase()));
        }
    }
    return codepoints;
}

function parseSupplement(text) {
    const lines = text.split(/\r?\n/);
    const codepoints = [];
    for (const line of lines) {
        if (!line.trim() || line.trim().startsWith('#')) continue;
        const match = line.match(/^([0-9a-fA-F ]+)\s*;/);
        if (match) {
            const cps = match[1].trim().split(/\s+/);
            codepoints.push(cps.map(cp => cp.toUpperCase()));
        }
    }
    return codepoints;
}

function main() {
    const emojiSeqPath = path.join(__dirname, 'public', 'emoji-sequences.txt');
    const supplementPath = path.join(__dirname, 'public', 'supplement.txt');
    const outPath = path.join(__dirname, 'src', 'utils', 'openmojiSequences.ts');

    const emojiSeqText = fs.readFileSync(emojiSeqPath, 'utf8');
    const supplementText = fs.readFileSync(supplementPath, 'utf8');

    const seqs = [
        ...parseEmojiSequences(emojiSeqText),
        ...parseSupplement(supplementText)
    ];

    const tsContent =
        '// Auto-generated list of emoji codepoint sequences from emoji-sequences.txt and supplement.txt\n' +
        '// Each entry is an array of codepoint strings (hex)\n' +
        'export const openmojiSequences: string[][] = [\n' +
        seqs.map(seq => `    [${seq.map(cp => `"${cp}"`).join(', ')}]`).join(',\n') +
        '\n];\n';

    fs.writeFileSync(outPath, tsContent, 'utf8');
    console.log(`Generated ${outPath} with ${seqs.length} sequences.`);
}

main();
