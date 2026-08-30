import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, 'src');

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: import type { Database }
  content = content.replace(/import\s+{\s*Database\s*}\s+from\s+['"]([^'"]+)['"]/g, "import type { Database } from '$1'");
  
  // Fix 2: import type { Node, Edge }
  content = content.replace(/import\s+{\s*ReactFlow,\s*Controls,\s*Background,\s*Node,\s*Edge\s*}\s+from\s+['"]@xyflow\/react['"]/g, "import { ReactFlow, Controls, Background } from '@xyflow/react';\nimport type { Node, Edge } from '@xyflow/react'");

  // Fix 3: Remove import React
  content = content.replace(/import\s+React(,\s*{\s*([^}]+)\s*})?\s+from\s+['"]react['"];?/g, (match, p1, p2) => {
    if (p2) {
      return `import { ${p2} } from 'react';`;
    }
    return '';
  });

  // Fix 4: any any any
  content = content.replace(/import React from 'react';?/g, '');
  
  // Clean up empty lines at the top
  content = content.replace(/^\s*[\r\n]/gm, (m, offset) => offset < 100 ? '' : m);

  fs.writeFileSync(filePath, content, 'utf8');
}

function traverse(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  }
}

traverse(directory);
console.log('Fixed TS errors.');
