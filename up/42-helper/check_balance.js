const fs = require('fs');
const content = fs.readFileSync('tester-project.html', 'utf8');
const lines = content.split(/\r?\n/);

let inScript = false;
let scriptContent = '';
for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    if (lineNum >= 428 && lines[i].includes('<script>') && !inScript) {
        if (!lines[i].includes('src=')) {
            inScript = true;
            continue;
        }
    }
    if (inScript) {
        scriptContent += lines[i] + '\n';
        if (lines[i].includes('</script>')) {
            break;
        }
    }
}

const openBraces = (scriptContent.match(/{/g) || []).length;
const closeBraces = (scriptContent.match(/}/g) || []).length;
const openBrackets = (scriptContent.match(/\[/g) || []).length;
const closeBrackets = (scriptContent.match(/\]/g) || []).length;
const openParens = (scriptContent.match(/\(/g) || []).length;
const closeParens = (scriptContent.match(/\)/g) || []).length;
const functionKeywords = (scriptContent.match(/\bfunction\b/g) || []).length;

console.log('=== BALANCE CHECK RESULTS ===');
console.log('Opening braces   { : ' + openBraces);
console.log('Closing braces   } : ' + closeBraces);
console.log('Opening brackets [ : ' + openBrackets);
console.log('Closing brackets ] : ' + closeBrackets);
console.log('Opening parens   ( : ' + openParens);
console.log('Closing parens   ) : ' + closeParens);
console.log('');
console.log('Function keyword count: ' + functionKeywords);
console.log('');
const balanced = openBraces === closeBraces && openBrackets === closeBrackets && openParens === closeParens;
console.log('All balanced? ' + balanced);

if (functionKeywords > 0) {
    // Find function declarations including async ones
    const funcDecls = scriptContent.match(/async\s+function\s+(\w+)|function\s+(\w+)\s*\(/g) || [];
    console.log('');
    console.log('Function declarations found:');
    funcDecls.forEach(f => {
        const clean = f.replace(/async\s+/, '').trim();
        const name = clean.replace('function', '').replace(/\s*\(/, '').trim();
        console.log('  - ' + name + '()');
    });
}

// Detailed reports
console.log('\n=== DETAILED REPORT ===');
if (openBraces !== closeBraces) {
    console.log(`WARNING: Braces mismatch - { count: ${openBraces}, } count: ${closeBraces} (diff: ${openBraces - closeBraces})`);
} else {
    console.log('Braces are balanced ✓');
}
if (openBrackets !== closeBrackets) {
    console.log(`WARNING: Brackets mismatch - [ count: ${openBrackets}, ] count: ${closeBrackets} (diff: ${openBrackets - closeBrackets})`);
} else {
    console.log('Brackets are balanced ✓');
}
if (openParens !== closeParens) {
    console.log(`WARNING: Parentheses mismatch - ( count: ${openParens}, ) count: ${closeParens} (diff: ${openParens - closeParens})`);
} else {
    console.log('Parentheses are balanced ✓');
}
