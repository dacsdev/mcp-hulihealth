# MCP HuliHealth

Production-ready Model Context Protocol (MCP) server for HuliHealth, providing modular tools and endpoints for healthcare automation, LLM agents, and workflow integrations.  
Written in Node.js/TypeScript and designed for maintainability, scalability, and secure authentication.

---

## 🚀 Features

- **Modular "tool-per-file" architecture** (see `/src/tools/`)
- **In-memory JWT authentication** (auto-refresh, transparent for users)
- **OpenAPI-based schemas** for all requests/responses
- **LLM/agent/n8n-friendly endpoints** for maximum automation
- **Legacy Python MCP** preserved for migration and comparison (`/legacy-python-mcp/`)

---

## 📂 Project Structure

/src/ # TypeScript source code (modular tools, services, etc.)
/legacy-python-mcp/ # Previous Python MCP (for migration/reference)
PROMPT.MD # Migration and architecture specification
openapi.json # Reference OpenAPI spec from HuliHealth

yaml
Copy
Edit

---

## 🛠️ Setup

1. **Install dependencies**
   ```bash
   npm install
(Optional, for legacy Python MCP):

bash
Copy
Edit
pip install -r legacy-python-mcp/requirements.txt
Configure environment variables
Copy .env.example to .env and set your keys:

ini
Copy
Edit
HULIHEALTH_API_KEY=your-key-here
HULI_ORG_ID=your-org-id
💡 How to Use
Run the MCP server:

bash
Copy
Edit
npm start
Tool/endpoint documentation:
See /PROMPT.MD for standards and /openapi.json for schemas.

🏛️ Migration Notes
The full Python MCP is available in /legacy-python-mcp/ for reference.

All new development must follow the standards described in /PROMPT.MD.

🤖 About
Created by dacsdev.
Designed for integration with LLM agents, workflow automation (n8n), and secure, enterprise-ready health tech platforms.

yaml
Copy
Edit

---

### **¿Cómo usarla?**
- Pega esto en tu `README.md`.
- Modifica los enlaces/autores si lo deseas.
- Puedes agregar badges de CI, coverage, etc. después.

---

¿Quieres agregar ejemplos de endpoints, o prefieres mantenerlo simple y técnico por ahora?
