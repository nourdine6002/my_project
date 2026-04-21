const fs = require('fs');
const content = fs.readFileSync('tester-project.html', 'utf8');

// Use generic newline split
const lines = content.split(/\r?\n/);

console.log('Total lines:', lines.length);
console.log('Line 428:', lines[427]); // 0-indexed
console.log('Line 936:', lines[935]);

let inScript = false;
let scriptContent = '';
for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    if (lineNum >= 428 && lines[i].includes('<script>') && !inScript) {
        console.log('Found opening <script> tag at line', lineNum, ':', lines[i].trim());
        // Check if it's the inline script (no src attribute)
        if (!lines[i].includes('src=')) {
            inScript = true;
            continue;
        }
    }
    if (inScript) {
        scriptContent += lines[i] + '\n';
        if (lines[i].includes('</script>')) {
            console.log('Found closing </script> at line', lineNum);
            break;
        }
    }
}

console.log('\nScript content length:', scriptContent.length, 'chars');
console.log('\nFirst 300 chars of script:');
console.log(scriptContent.substring(0, 300));
console.log('\nLast 100 chars of script:');
console.log(scriptContent.substring(scriptContent.length - 100));
