# MCP-HULIHEALTH Refactoring and Modernization to ES Modules

**Objective:** Refactor the entire TypeScript project from a mixed/CommonJS (CJS) structure to a pure ES Modules (ESM) structure. This involves updating file syntax, project configuration, and ensuring consistency across all `.ts` files.

---

### **Phase 1: Configuration Update**

1.  **`package.json`:**
    *   Add the property `"type": "module"` to the root of the JSON object. This is the primary switch to enable ESM in Node.js.

2.  **`tsconfig.json`:**
    *   Change the `compilerOptions.module` property from `"commonjs"` to `"NodeNext"`.
    *   Add the property `"compilerOptions.moduleResolution": "NodeNext"`.
    *   It's recommended to update `compilerOptions.target` to `"ES2022"`.

---

### **Phase 2: Source Code Refactoring**

**General Rule:** All `require()` and `module.exports` statements must be converted to `import` and `export` statements. When importing local files you've written, you **must** append the `.js` extension to the import path (e.g., `import { tools } from './toolRegistry.js'`).

**1. Refactor All Tools in `src/tools/`:**
*   **Instruction:** For every `.ts` file inside the `src/tools/` directory, apply the structure defined in the `templates/tool_template.ts` file.
*   **Details:**
    *   Convert all `require()` to `import`.
    *   Define and export the Zod schema and the inferred type.
    *   The main export of each tool file must be a `default export` of the tool object.

**2. Refactor `src/services/huliClient.ts`:**
*   **Instruction:** Convert this file to ESM.
*   **Details:**
    *   Change all `import` statements for local files to include the `.js` extension (e.g., `from '../mcp/schema.js'`).
    *   Instead of `export const huliClient = new HuliClient()`, export the instance as a default export: `export default new HuliClient()`. Or keep it as a named export `export const huliClient = ...` which is also fine. A single instance should be exported.

**3. Refactor `src/mcp/schema.ts`:**
*   **Instruction:** Ensure all types and interfaces are exported using named `export` statements (e.g., `export interface Appointment { ... }`). Remove any `module.exports`.

**4. Refactor `src/mcp/toolRegistry.ts`:**
*   **Instruction:** This file must aggregate all tools using ESM syntax.
*   **Details:**
    *   Use `import toolName from '../tools/toolName.js'` for each tool.
    *   Create an array named `tools` containing all imported tool objects.
    *   Export the array using a named export: `export const tools = [...]`.

**5. Refactor `src/cli.ts`:**
*   **Instruction:** This is a critical file. It must be rewritten to work in an ESM context.
*   **Details:**
    *   Convert all `require()` to `import`. Remember to add `.js` extensions for local imports.
    *   The entry point detection logic `if (require.main === module)` **must be replaced** with the ESM equivalent using `import.meta.url`.

**6. Refactor `src/index.ts`:**
*   **Instruction:** This file should serve as the main entry point for library usage.
*   **Details:**
    *   Use `export * from './mcp/toolRegistry.js'` and `export * from './services/huliClient.js'` to re-export the project's main components.

---

**Final Check:** After all modifications, the project should not contain any `require()` or `module.exports` statements in the `src` directory. All local file imports must end with `.js`.
