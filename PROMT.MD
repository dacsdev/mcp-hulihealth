
## 🚀 Objective

Rebuild the HuliHealth Model Context Protocol (MCP) server as a professional, maintainable, and scalable **Node.js + TypeScript** project, following OpenAI Cookbook best practices and modular, agent-centric architecture.  
The MCP should expose all major tools (actions) defined in the HuliHealth OpenAPI and be easily consumable by LLMs, agents, and workflow tools (such as n8n).

## 📚 References & Best Practices

- [OpenAI Cookbook](https://cookbook.openai.com/)
- Firecrawl/Anthropic modular tool/action patterns
- Standard OpenAPI/Swagger naming and types
- Type safety and composability (TypeScript 5+)
- LLM-friendly tool schemas and endpoint documentation

## 🏗️ Project Structure (Directory Layout)

```bash
hulihealth-mcp/
├── src/
│   ├── index.ts                  # Fastify server and entrypoint
│   ├── tools/                    # One file per tool/action (highly modular)
│   │   ├── scheduleAppointment.ts
│   │   ├── cancelAppointment.ts
│   │   ├── ...
│   ├── mcp/
│   │   ├── schema.ts             # Shared OpenAPI types (Appointment, Patient, etc.)
│   │   └── toolRegistry.ts       # Tool registry for HTTP/LLM/meta endpoints
│   ├── services/
│   │   └── huliClient.ts         # Central API client: handles auth, JWT caching, HTTP requests
│   └── utils/                    # Auth helpers, logging, parameter validation, etc.
├── bin/
│   └── cli.js                    # CLI entrypoint for npx use
├── mcp.yaml                      # LLM/agent tool registry (optional)
├── .env.example
├── README.md
├── package.json
├── tsconfig.json


🛡️ Authentication & Secure API Calls
JWT Management:

On startup (or at first request), the MCP automatically fetches a JWT from Huli’s API using HULIHEALTH_API_KEY.

JWT is stored in memory and injected into every API call.

On receiving a 401/403 from Huli’s API, the MCP transparently refreshes the JWT and retries the request once.

End-users of the MCP never see or manage the JWT; only HULIHEALTH_API_KEY and HULI_ORG_ID are required in the environment.

HTTP Headers in all requests to Huli API:

Authorization: Bearer {JWT}

id_organization: {HULI_ORG_ID}

Environment variables (documented in .env.example and README):

HULIHEALTH_API_KEY=
HULI_ORG_ID=

🧩 Tool (Action) Definition: Modular, LLM/Agent-Friendly
Each tool file must export:

name (string, snake_case)

description (rich Markdown: when to use, common mistakes, usage example, etc.)

parameters (TypeScript type, JSON Schema or Zod)

execute (async function: receives validated args, calls Huli API, returns response)

Example: src/tools/scheduleAppointment.ts

import { Tool } from '../mcp/toolRegistry';
import { CreateAppointmentRequest, Appointment } from '../mcp/schema';
import { huliClient } from '../services/huliClient';

export const scheduleAppointment: Tool = {
  name: 'schedule_appointment',
  description: `
Schedules a new appointment in the HuliHealth system.

**Best for:** Creating a medical appointment for a patient with a specific doctor and clinic.
**Common mistakes:** Using for rescheduling or canceling (use the dedicated tools).
**Usage Example:**
\`\`\`json
{
  "doctor_id": "123",
  "clinic_id": "456",
  "patient_file_id": "789",
  "start_date": "2025-08-01",
  "time_from": "09:00:00"
}
\`\`\`
`,
  parameters: { /* see OpenAPI for full schema */ },
  async execute(args) {
    return await huliClient.createAppointment(args);
  }
}

🗂️ Tool Registry & LLM Metadata Endpoints
Expose the following HTTP endpoints:

GET /mcp/tools → List all tool metadata (for LLM/agent introspection)

POST /mcp/tool/execute/:tool → Execute a given tool by name, with validated parameters in the body

GET /mcp/schema → Return all data types (Appointment, Doctor, Patient, etc.)

All endpoints are documented, strongly typed, and auto-discoverable.

🔗 n8n/CLI Integration
Must be executable via npx hulihealth-mcp

Should expose HTTP endpoints by default, but may also support CLI use

Example n8n config (in README):

{
  "mcpServers": {
    "hulihealth-mcp": {
      "command": "npx",
      "args": ["-y", "hulihealth-mcp"],
      "env": {
        "HULIHEALTH_API_KEY": "...",
        "HULI_ORG_ID": "..."
      }
    }
  }
}

🧪 Testing & Quality
Use Vitest or Jest for unit/integration tests.

ESLint + Prettier for code quality and formatting.

All tools must have at least one test file.

Scripts for build, test, lint, and format in package.json.

📄 README Requirements
Setup instructions: Node version, install, env variables

How to run via npx

How to add new tools

How to call tools via HTTP

Tool and schema auto-documentation

🟩 OpenAI Cookbook Best Practices to Follow
Prefer one module per agent/tool/skill for maintainability

Use typed schemas for input/output and validate with Zod or similar

Include rich Markdown descriptions for every tool/action

Centralize authentication; never expose tokens to end users

Favor modular, composable code and “composition over inheritance”

Use shared type definitions (schema.ts) derived from OpenAPI

Document all endpoints and types for easy agent discovery

❗️Constraints
Never require users to pass a JWT token; the MCP handles all authentication internally.

Do not hardcode secrets; always use environment variables.

All types, endpoint names, and parameters must exactly match the provided OpenAPI.

Ensure the project is extensible: adding a new tool/action is as simple as creating a new file and registering it.

🏆 Expected Result
A production-grade, modular, TypeScript-based MCP server for HuliHealth, that is:

Secure and transparent in authentication

Fully typed and validated

LLM/agent/n8n friendly

Extensible and maintainable for any new tool or endpoint

Easy to test, document, and use in modern automation workflows

Use this prompt as your master spec.
Ask for clarifications as needed, and refer to the OpenAPI for all input/output schemas and endpoint details.