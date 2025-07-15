# MCP HuliHealth

A production-ready Model Context Protocol (MCP) server for HuliHealth. This CLI allows n8n or other automation tools to invoke HuliHealth APIs through a standard MCP interface.

---

## 🚀 Features

- **Modular tool-per-file architecture** in `src/tools/`
- **OpenAPI-based schemas** for type safety
- **STDIO or SSE modes** for integration flexibility
- **Designed for n8n and LLM agents**

---

## 📂 Project Structure

```
src/           TypeScript source
openapi.json   Reference Huli API specification
PROMT.md       Architecture notes
```

---

## 🛠️ Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   Copy `.env.example` to `.env` and set your credentials.

### Running the CLI

Use `npx` to start the server. Without arguments it runs in STDIO mode. Add `--sse` or set `PORT` to start an HTTP SSE server.

```bash
npx hulihealth-mcp-dacs           # STDIO mode
npx hulihealth-mcp-dacs --sse     # SSE mode on port $PORT or 3000
```

### Generating new tools

Create new MCP tools with the `mcp-gen-tool` helper:

```bash
npm run mcp-gen-tool create-tool --name=<toolName>
```

The command scaffolds `src/tools/<toolName>.ts` with a basic template. After
editing the file remember to register the tool in `src/mcp/toolRegistry.ts`.

### n8n Integration

Example configuration to run the MCP from an n8n workflow:

```json
{
  "mcpServers": {
    "hulihealth-mcp": {
      "command": "npx",
      "args": ["-y", "hulihealth-mcp-dacs"],
      "env": {
        "HULIHEALTH_API_KEY": "YOUR-API-KEY",
        "HULI_ORG_ID": "YOUR-ORG-ID"
      }
    }
  }
}
```

---

## 🔑 Environment Variables

- `HULIHEALTH_API_KEY` – your API key (required)
- `HULI_ORG_ID` – your organization ID (required)
- `PORT` – optional port for SSE mode

---

Created by dacsdev.
