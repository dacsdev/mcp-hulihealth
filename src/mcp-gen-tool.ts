#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function printHelp() {
  console.log(`Usage: mcp-gen-tool create-tool --name <toolName>`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options: Record<string, string> = {};
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.replace(/^--/, '').split('=');
      if (value !== undefined) {
        options[key] = value;
      } else {
        options[key] = args[i + 1];
        i++;
      }
    }
  }
  return { command, options };
}

async function createTool(name: string) {
  if (!name) {
    console.error('Error: tool name is required.');
    process.exit(1);
  }
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const srcToolsDir = path.resolve(__dirname, 'tools');
  const filePath = path.join(srcToolsDir, `${name}.ts`);

  try {
    await fs.access(filePath);
    console.error(`[mcp-gen-tool] Tool '${name}' already exists at ${filePath}`);
    process.exit(1);
  } catch {
    // file does not exist
  }

  const inputSchemaName = `${name}InputSchema`;
  const outputSchemaName = `${name}OutputSchema`;

  const template = `import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';

// Input Schema
export const ${inputSchemaName} = z.object({
  // TODO: define parameters
}).describe('Input parameters for ${name}');

// Output Schema
export const ${outputSchemaName} = z.object({
  // TODO: define result fields
}).describe('Result of ${name}');

export async function execute(params: z.infer<typeof ${inputSchemaName}>) {
  const validatedParams = ${inputSchemaName}.parse(params);

  // Call HuliHealth API through huliClient
  const result = await huliClient.${name}(validatedParams as any);

  return ${outputSchemaName}.parse(result);
}

export const toolDefinition = {
  name: '${name}',
  description: 'TODO: Describe ${name}',
  parameters: ${inputSchemaName},
  execute,
};

export default toolDefinition;
`;

  await fs.writeFile(filePath, template);
  console.log(`[mcp-gen-tool] Created new tool at ${filePath}`);
  console.log('[mcp-gen-tool] Remember to register the tool in src/mcp/toolRegistry.ts');
}

async function main() {
  const { command, options } = parseArgs();
  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }
  if (command === 'create-tool') {
    const name = options.name;
    if (!name) {
      console.error('Error: --name is required');
      printHelp();
      process.exit(1);
    }
    await createTool(name);
  } else {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[mcp-gen-tool] Failed:', err);
  process.exit(1);
});
