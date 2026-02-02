# Technical Specification: FloraAgentic - Medical Device AI System

**Version:** 1.0.0  
**Date:** October 26, 2023  
**Status:** Final  
**Author:** Senior Frontend Engineering Team

---

## 1. Executive Summary

**FloraAgentic** is a specialized, agentic AI system designed to assist Regulatory Affairs (RA) professionals in the medical device industry. The application serves as a comprehensive workspace for generating, reviewing, and organizing complex regulatory documentation, specifically targeting Taiwan TFDA Premarket applications and US FDA 510(k) submissions.

The system differentiates itself through a unique "Biophilic UI" design philosophy, integrating 20 distinct flower-themed aesthetic styles to reduce cognitive load during intensive document review tasks. Technically, it is a client-side Single Page Application (SPA) built with React 19 and TypeScript, leveraging the Google Gemini API (via `@google/genai` SDK) for intelligent text generation and analysis.

This document serves as the authoritative technical reference for the FloraAgentic system, detailing its architecture, data models, component specifications, and integration logic based on the current codebase.

---

## 2. System Architecture

### 2.1. High-Level Overview
FloraAgentic operates as a serverless, client-side application. It relies on the browser's execution environment for all logic, state management, and API orchestration. External communication is limited to the Google Gemini API for inference tasks.

*   **Frontend Framework:** React 19 (via ES Modules/ESM).
*   **Styling Engine:** Tailwind CSS (Utility-first) + Dynamic Inline Styles for Theming.
*   **Language:** TypeScript (Strict typing for regulatory data structures).
*   **AI Inference:** Google Gemini 2.5 Flash (via `@google/genai`).
*   **Visualization:** Recharts (Data visualization for usage logs).
*   **Icons:** Lucide React.

### 2.2. Module Loading Strategy
The application utilizes an `importmap` defined in `index.html` to load dependencies directly from a CDN (`esm.sh`). This eliminates the need for complex server-side bundling during the runtime of the demo, although a build step is implied for production optimization.

**Dependencies:**
*   `react`, `react-dom`: UI library.
*   `@google/genai`: The official SDK for interacting with Gemini models.
*   `lucide-react`: Iconography.
*   `recharts`: Statistical charting.

### 2.3. Entry Point & bootstrapping
The application entry point is defined in `index.tsx`. It performs a strict null check on the DOM root element before hydrating the React application via `ReactDOM.createRoot`. This ensures the application fails gracefully if the hosting environment is misconfigured.

---

## 3. UI/UX & Theming Engine

One of the most complex subsystems in FloraAgentic is its dynamic theming engine, designed to provide "Jackpot" style variability.

### 3.1. The FlowerStyle Interface
Defined in `types.ts`, the `FlowerStyle` interface governs the application's entire color palette. Unlike traditional CSS variables, themes are injected as JavaScript objects containing Tailwind utility class strings.

```typescript
export interface FlowerStyle {
  name: string;     // Display name (e.g., "Rose")
  gradient: string; // Main background gradient (e.g., "bg-gradient-to-br...")
  sidebar: string;  // Sidebar background with opacity
  card: string;     // Card/Panel background with glassmorphism
  accent: string;   // Primary interaction color (Text)
  text: string;     // Primary typography color
}
```

### 3.2. Theme Application Logic
The `App.tsx` component serves as the context provider for styles.
1.  **State Management:** `settings.styleName` tracks the currently selected flower.
2.  **Memoization:** `currentStyle` is derived using `useMemo` to prevent unnecessary re-calculations of the theme object during unrelated state updates (like typing in a form).
3.  **Cascading:** The `currentStyle` object is passed down as a prop to all container components (`Sidebar`, `Dashboard`, `TwPremarket`, etc.), ensuring instant, synchronized theme switching.
4.  **Dark Mode:** Implemented via a CSS filter inversion strategy in the root `div` of `App.tsx`:
    `settings.theme === 'Dark' ? 'brightness-90 invert-[0.05]' : ''`
    This provides a pseudo-dark mode without requiring a separate set of dark-specific color tokens for every flower theme.

### 3.3. The "Jackpot" Mechanic
Located in `Sidebar.tsx`, the `handleJackpot` function utilizes `Math.random()` to select one of the 20 available styles from `FLOWER_STYLES` in `constants.ts`. This gamification element is intended to break the monotony of regulatory work.

---

## 4. Data Models & Type Definitions

The system relies on strict TypeScript definitions to ensure data integrity, particularly for the medical device application forms.

### 4.1. TwAppData (Taiwan Premarket Application)
This is the largest data structure in the application, representing a digitized version of the TFDA Class II/III medical device application form. It is categorized into five logical sections:

1.  **Basic Data:** Metadata about the submission (Doc No, E-No, Apply Date, Device Category, Product Class).
2.  **Device Info:** Core product identity (Chinese/English names, Indications, Specifications, Classification codes).
3.  **Applicant Data:** Corporate details of the local license holder (Uniform ID, Address, Contact Info, RAPS/AHWP certifications).
4.  **Manufacturer Info:** Manufacturing site details, including country and manufacturing type (OEM/Odm).
5.  **Attachments/Details:** Complex text fields for QMS/QSD, Technical Files, Clinical Evidence, and Pre-clinical testing summaries.

### 4.2. Agent Configuration
The `AgentConfig` interface defines the behavior of the AI assistants:
*   `systemPrompt`: The "brain" of the agent, defining its persona (e.g., "You are a TFDA premarket screen reviewer").
*   `maxTokens`: Output limits to manage latency and cost.
*   `category`: Grouping for the UI (TFDA, FDA, Productivity).

### 4.3. Logging
The `LogEntry` interface tracks system usage:
*   `tokensEst`: A heuristic calculation (`(input + output) / 4`) used to estimate token consumption for the Dashboard, as the exact token count isn't always exposed in the simplified client-side response.

---

## 5. Component Specifications

### 5.1. Sidebar (`components/Sidebar.tsx`)
*   **Role:** Global navigation and configuration controller.
*   **Features:**
    *   **Theme/Language Toggles:** Updates the global `Settings` state.
    *   **Style Selector:** Dropdown for specific flower selection + Jackpot button.
    *   **API Key Management:** A secure input field for the Google Gemini API key. It conditionally renders a disabled state if `process.env.API_KEY` is detected (via the `isEnvKey` prop), preventing users from overriding the environment-injected key while confirming its presence.

### 5.2. Dashboard (`components/Dashboard.tsx`)
*   **Role:** Analytics center for user activity.
*   **Visualizations:**
    *   **Stat Cards:** Displays Total Runs, Estimated Tokens, and Unique Tabs used.
    *   **Bar Chart:** Uses `recharts` to plot activity frequency per Agent Tab.
    *   **Log Table:** A reverse-chronological list of the last 5 interactions, showing timestamps, agent names, and models used.
*   **Data Source:** Consumes the `logs` array passed from `App.tsx`.

### 5.3. TW Premarket Module (`components/TwPremarket.tsx`)
This is the flagship functional module of the system.
*   **State:** Manages a massive `formData` object corresponding to `TwAppData`.
*   **View Modes:**
    1.  **Form View:** A responsive grid layout (using Tailwind `grid-cols-1 md:grid-cols-6`) for data entry. It includes collapsible sections for "Attachments/Details" to manage vertical screen real estate.
    2.  **Draft View:** Displays the generated Markdown.
    3.  **AI Report View:** Displays the analysis result from Gemini.
*   **Logic - Markdown Generation:** The `generateMarkdown` function deterministically maps the `formData` state into a formatted Markdown string, suitable for copy-pasting into external documentation tools (e.g., Notion, Obsidian).
*   **Logic - AI Screen Review:** The `handleScreenReview` function constructs a two-part prompt:
    1.  **System Instruction:** "You are a TFDA premarket screen reviewer..."
    2.  **User Content:** A JSON stringification of `formData` + specific instructions to check for completeness and inconsistencies.

### 5.4. Generic Agent (`components/GenericAgent.tsx`)
*   **Role:** A reusable wrapper for simple Text-In/Text-Out AI tasks.
*   **Usage:** Used for "510(k) Analyst", "PDF to Markdown", and "Note Organizer".
*   **Props:** Accepts `systemPrompt`, `defaultInput`, and `placeholder` to customize the agent's behavior without duplicating UI code.
*   **Layout:** A Split-pane design (Input Left/Top, Output Right/Bottom) optimized for comparison and editing.

### 5.5. Agents Configuration (`components/AgentsConfig.tsx`)
*   **Role:** Transparency viewer.
*   **Function:** Displays the hardcoded agent definitions from `DEFAULT_AGENTS` in `constants.ts`. It allows users to see *how* the AI is being instructed, building trust in the system's "reasoning" process.

---

## 6. Integration Service: Gemini API

The `services/geminiService.ts` module acts as the abstraction layer between the React UI and the Google GenAI SDK.

### 6.1. Model Resolution Strategy
To ensure robustness and compliance with specific model versioning (as dictated by the prompt guidelines), the service implements a `MODEL_MAPPING` dictionary:
```typescript
const MODEL_MAPPING: Record<string, string> = {
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-flash-lite": "gemini-2.5-flash-lite-latest",
  // Fallbacks for simulated legacy/competitor models
  "gpt-4o-mini": "gemini-2.5-flash", 
  "gpt-4.1-mini": "gemini-2.5-flash",
  "claude-3-5-sonnet-2024-10": "gemini-2.5-flash",
};
```
This ensures that even if the UI theoretically allowed selecting a competitor model (for comparison scenarios), the backend logic safely routes the request to a supported Google Gemini model (`gemini-2.5-flash`).

### 6.2. Content Generation Flow
1.  **Validation:** Checks for the existence of an API Key.
2.  **Instantiation:** Creates a new `GoogleGenAI` client instance for every request. This is stateless and safe for client-side use where the key might change.
3.  **Request Construction:** Calls `ai.models.generateContent` with:
    *   `model`: The resolved model string.
    *   `contents`: The user's input.
    *   `config`: Includes `systemInstruction` and `temperature`.
4.  **Error Handling:** Wraps the async call in a try/catch block to return user-friendly error strings instead of crashing the UI.

---

## 7. Functional Specifications & Workflows

### 7.1. Application Lifecycle
1.  **Initialization:**
    *   App mounts.
    *   Checks `process.env.API_KEY`.
    *   Sets initial state (Language: English, Theme: Rose).
2.  **Configuration:**
    *   User enters API key in Sidebar (if not in env).
    *   User selects a Flower Style (or clicks Jackpot).
3.  **Task Execution (Example: TW Premarket):**
    *   User navigates to "TW Premarket" tab.
    *   User fills out the 5-section form (Doc No, Manufacturer, etc.).
    *   User clicks "Generate Draft MD" -> System produces formatted text.
    *   User clicks "Run Screen Review Agent" -> System sends JSON payload to Gemini -> System displays regulatory analysis.
4.  **Logging:**
    *   Upon successful agent completion, `addLog` is called.
    *   Dashboard updates real-time charts and counters.

### 7.2. Internationalization (i18n)
The system supports English and Traditional Chinese.
*   **Implementation:** A `LABELS` object in `constants.ts` maps keys (e.g., `TwPremarket`) to their translations.
*   **Usage:** Components use a helper function `t(key)` to retrieve the string based on `settings.language`.
*   **Scope:** Localization covers UI labels, navigation, and static headers. Note: The *content* generated by the AI depends on the prompt; currently, prompts are in English ("You are a TFDA reviewer..."), which means the AI output will likely be English unless explicitly instructed otherwise in the user input.

---

## 8. Security & Configuration

### 8.1. API Key Handling
*   **Environment Variable:** The system prioritizes `process.env.API_KEY`. If present, the UI field is locked and masked.
*   **User Input:** If no env var is found, the user manually inputs the key.
*   **Storage:** The key is stored in React State (`settings.apiKey`). It is **not** persisted to `localStorage` or `cookies` in this codebase, meaning a page refresh clears the key. This is a security feature for shared workstations.
*   **Transmission:** The key is sent directly to Google's API endpoint via the SDK. It is not routed through any intermediate proxy server in this architecture.

---

## 9. Performance Considerations

### 9.1. Rendering Optimization
*   **Tailwind CSS:** Usage of atomic utility classes ensures the CSS bundle size remains small and constant, regardless of the number of unique "Flower Styles".
*   **React StrictMode:** Enabled in `index.tsx` to highlight potential side effects during development.
*   **Lazy Loading:** Not currently implemented (single bundle), but the modular structure allows for future code-splitting of heavy components like `TwPremarket` or `Recharts`.

### 9.2. AI Latency
*   **Model Selection:** The system defaults to `gemini-2.5-flash`. The "Flash" series is specifically chosen for low latency and high throughput, essential for interactive form reviews where the user is waiting for feedback.
*   **Token Management:** The "Note Organizer" is capped at 2000 tokens, while "TFDA Screen Review" is capped at 4000 tokens. This segmentation ensures appropriate resource allocation based on task complexity.

---

## 10. Future Roadmap & Extensibility

Based on the current architecture, the following extensions are technically viable:

1.  **Persistence:** Implementing `localStorage` persistence for the `formData` in `TwPremarket` to prevent data loss on refresh.
2.  **PDF Parsing:** The "PDF to Markdown" agent currently relies on the user pasting raw text. Integrating a client-side PDF parser (like `pdf.js`) would automate the extraction step.
3.  **Prompt Engineering:** The current system prompts are hardcoded in `constants.ts` and components. Moving these to a user-editable configuration panel would allow "Agent Tuning."
4.  **Backend Integration:** For production use, moving the API Key handling to a server-side proxy would obscure the key from the client browser.

---

## 11. Conclusion

FloraAgentic represents a modern approach to specialized vertical AI applications. By combining a highly specific domain focus (Medical Device RA) with a robust "Agentic" framework and a user-centric "Biophilic" design, it addresses both the functional requirements of regulatory compliance and the user experience needs of professionals performing repetitive, high-stress tasks. The codebase is modular, strongly typed, and built on industry-standard technologies, providing a solid foundation for future development.