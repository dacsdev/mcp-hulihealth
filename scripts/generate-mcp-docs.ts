#!/usr/bin/env node
import fs from 'fs';
import { tools } from '../src/mcp/toolRegistry.js';

interface ToolDoc {
  name: string;
  description: string;
}

const docs: ToolDoc[] = tools.map(t => ({
  name: t.name,
  description: t.description,
}));

const yaml = docs
  .map(d => `- name: ${d.name}\n  description: ${d.description}`)
  .join('\n');

fs.writeFileSync('mcp.yaml', yaml);
console.log('mcp.yaml generated');
