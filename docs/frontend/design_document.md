# Frontend Design Document - Lumina RAG Workspace

## 1. Introduction
Lumina RAG Workspace is a Single Page Application (SPA) designed to provide a secure and interactive interface for Retrieval-Augmented Generation (RAG) tasks. It enables users to upload documents and interact with them using Google's Gemini AI models. The application emphasizes ease of use, secure document handling within the browser session, and role-based access control.

## 2. Architecture Overview

### 2.1 Tech Stack
*   **Framework**: React 18+ (Functional Components, Hooks)
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Markdown Rendering**: `react-markdown`

### 2.2 Folder Structure
The project follows a feature-based and type-based organization within `frontend/src`:
*   `assets/`: Static assets (fonts, images, global styles).
*   `components/`:
    *   `common/`: Reusable UI components (Buttons, Inputs).
    *   `specific/`: Feature-specific components (`ChatArea`).
*   `layouts/`: Layout components (`FileSidebar`).
*   `pages/`: Top-level page views (`LoginScreen`, `AdminDashboard`).
*   `services/`: Business logic and API integrations (`geminiService`, `authService`).
*   `utils/`: Helper functions (`fileUtils`).
*   `types.ts`: Centralized type definitions.

## 3. Component Architecture

The application uses `App.tsx` as the central controller and state container.

### 3.1 Core Components
*   **`App.tsx`**:
    *   Manages global state: `currentUser`, `settings`, `files`, `messages`.
    *   Handles routing logic (conditional rendering based on auth state and view mode).
    *   Orchestrates data flow between services and UI components.
*   **`LoginScreen` (`src/pages/LoginScreen.tsx`)**:
    *   Entry point for unauthenticated users.
    *   Provides a mock login interface with demo accounts.
*   **`AdminDashboard` (`src/pages/AdminDashboard.tsx`)**:
    *   Accessible only to admins.
    *   Allows management of users and application settings (System Prompt, LLM Mode, Theme).
*   **`ChatArea` (`src/components/specific/ChatArea.tsx`)**:
    *   Displays the chat history.
    *   Renders Markdown responses from the AI.
    *   Handles user input and submission.
*   **`FileSidebar` (`src/layouts/FileSidebar.tsx`)**:
    *   Manages the list of uploaded documents.
    *   Handles file selection and conversion to Base64.
    *   Enforces role-based permissions (e.g., Viewers cannot upload).

## 4. Data Models

Key interfaces defined in `src/types.ts`:

*   **`User`**: Represents an authenticated user with a `role` ('admin', 'manager', 'viewer').
*   **`ChatMessage`**: Represents a single message in the conversation history (`role`, `text`, `timestamp`).
*   **`UploadedFile`**: Represents a file processed for RAG (`mimeType`, `data` as Base64).
*   **`AppSettings`**: Configuration object for the application (`systemPrompt`, `modelName`, `theme`, `llmMode`).

## 5. State Management

Currently, the application utilizes **Local State** lifted up to `App.tsx`.
*   **Global State**: `user`, `settings`, `files`, `messages` are held in `App` and passed down via props.
*   **Persistence**: `AppSettings` are persisted to `localStorage` to maintain user preferences across sessions.
*   **Context API**: The folder structure includes `contexts/`, reserved for future migration to Context API to avoid prop drilling as the app grows.

## 6. Services

### 6.1 Gemini Service (`src/services/geminiService.ts`)
*   Initializes the `GoogleGenAI` client.
*   Constructs the prompt by combining:
    1.  System Instructions (from settings).
    2.  Uploaded Files (converted to inline data parts).
    3.  Chat History.
    4.  Current User Prompt.
*   Manages generation config (Temperature, TopK, TopP) based on the selected `LLMMode`.

### 6.2 Auth Service (`src/services/authService.ts`)
*   Provides mock authentication functions (`login`, `getUsers`).
*   Simulates a user database for demonstration purposes.

### 6.3 File Utils (`src/utils/fileUtils.ts`)
*   Handles file reading using `FileReader`.
*   Converts files to Base64 strings required by the Gemini API.
*   Formats file sizes for display.

## 7. UI/UX Design

*   **Theme System**: Supports Light and Dark modes. The theme is applied via dynamic body styles and conditional Tailwind classes.
*   **Responsive Design**:
    *   **Desktop**: Sidebar is persistent on the left.
    *   **Mobile**: Sidebar is collapsible/overlay. Navigation moves to the top.
*   **Feedback**:
    *   Loading states during AI generation.
    *   Error handling for failed API calls.
    *   Visual indicators for user roles.

## 8. Security & Configuration

*   **API Key**: The Gemini API key is loaded from `import.meta.env.VITE_GEMINI_API_KEY` (or `process.env` via Vite define).
*   **Data Privacy**: Documents are processed locally in the browser and sent directly to the Gemini API. No intermediate backend storage is used in this version.
*   **Access Control**: UI elements are conditionally rendered based on the user's role (e.g., Upload button hidden for Viewers).

## 9. UI Layout Wireframes

### 9.1 Main Chat Interface
```text
+-----------------------------------+---------------------------------------------------------------+
| [Sidebar] (FileSidebar)           | [Main Content] (ChatArea)                                     |
|                                   |                                                               |
| +-------------------------------+ | +-----------------------------------------------------------+ |
| | Header                        | | | Header (User Profile, Logout)                             | |
| | [Logo] Knowledge Base         | | +-----------------------------------------------------------+ |
| +-------------------------------+ |                                                               |
| | Upload Area                   | | +-----------------------------------------------------------+ |
| | [Cloud Icon]                  | | | Message List                                              | |
| | Click to upload               | | |                                                           | |
| +-------------------------------+ | | [Bot Avatar]                                              | |
| | File List                     | | |  +---------------------------------------------------+    | |
| | - doc1.pdf                    | | |  | Hello! How can I help you with your documents?    |    | |
| | - image.png                   | | |  +---------------------------------------------------+    | |
| |                               | | |                                                           | |
| |                               | | |                                          [User Avatar]    | |
| |                               | | |    +---------------------------------------------------+  | |
| |                               | | |    | Summarize this PDF.                               |  | |
| |                               | | |    +---------------------------------------------------+  | |
| |                               | | |                                                           | |
| +-------------------------------+ | +-----------------------------------------------------------+ |
|                                   | | Input Area                                                  | |
|                                   | | +-------------------------------------------------------+ | |
|                                   | | | [ Text Input .................................... ]   | | |
|                                   | | |                                         [Send Button] | | |
|                                   | | +-------------------------------------------------------+ | |
|                                   | +-----------------------------------------------------------+ |
+-----------------------------------+---------------------------------------------------------------+
```

### 9.2 Admin Dashboard
```text
+-----------------------------------------------------------------------------------------------+
| Header                                                                                        |
| [Shield] Admin Control Panel                                                        [Close X] |
+-----------------------------------+-----------------------------------------------------------+
| [Nav Sidebar]                     | [Content Area]                                            |
|                                   |                                                           |
| +-------------------------------+ | +-------------------------------------------------------+ |
| | [Users]                       | | | Add New User Form                                     | |
| | [Settings]                    | | | [Username] [Role v] [Add Button]                      | |
| |                               | | +-------------------------------------------------------+ |
| |                               | |                                                           | |
| |                               | | +-------------------------------------------------------+ |
| |                               | | | User List Table                                       | |
| |                               | | | Name          | Role      | Actions                   | |
| |                               | | | ----------------------------------------------------- | |
| |                               | | | [Avatar] Admin| Admin     |                           | |
| |                               | | | [Avatar] Bob  | Viewer    | [Delete]                  | |
| |                               | | +-------------------------------------------------------+ |
| +-------------------------------+ +-----------------------------------------------------------+ |
+-----------------------------------+-----------------------------------------------------------+
```

### 9.3 Admin Dashboard (Settings View)
```text
+-----------------------------------------------------------------------------------------------+
| Header                                                                                        |
| [Shield] Admin Control Panel                                                        [Close X] |
+-----------------------------------+-----------------------------------------------------------+
| [Nav Sidebar]                     | [Content Area]                                            |
|                                   |                                                           |
| +-------------------------------+ | +-------------------------------------------------------+ |
| | [Users]                       | | | Appearance                                            | |
| | [Settings] (Active)           | | | [Font Dropdown v]      [Theme Dropdown v]             | |
| |                               | | +-------------------------------------------------------+ |
| |                               | |                                                           | |
| |                               | | +-------------------------------------------------------+ |
| |                               | | | Model Configuration                                   | |
| |                               | | | LLM Mode: [Precise] [Balanced] [Creative]             | |
| |                               | | | Fine-Tuned ID: [___________________________________]  | |
| |                               | | +-------------------------------------------------------+ |
| |                               | |                                                           | |
| |                               | | +-------------------------------------------------------+ |
| |                               | | | System Instructions                                   | |
| |                               | | | +---------------------------------------------------+ | |
| |                               | | | | You are a helpful assistant...                    | | |
| |                               | | | |                                                   | | |
| |                               | | | +---------------------------------------------------+ | |
| |                               | | +-------------------------------------------------------+ |
| |                               | |                                          [Save Settings]| |
| +-------------------------------+ +-----------------------------------------------------------+ |
+-----------------------------------+-----------------------------------------------------------+
```

### 9.4 Admin Dashboard (RAG Training View)
```text
+-----------------------------------------------------------------------------------------------+
| Header                                                                                        |
| [Shield] Admin Control Panel                                                        [Close X] |
+-----------------------------------+-----------------------------------------------------------+
| [Nav Sidebar]                     | [Content Area]                                            |
|                                   |                                                           |
| +-------------------------------+ | +-------------------------------------------------------+ |
| | [Users]                       | | | RAG Knowledge Base Status                             | |
| | [Settings]                    | | +-------------------------------------------------------+ |
| | [RAG Training] (Active)       | |                                                           | |
| |                               | | +-------------------------------------------------------+ |
| |                               | | | Uploaded Documents                                    | |
| |                               | | | Name          | Size      | Status                    | |
| |                               | | | ----------------------------------------------------- | |
| |                               | | | [PDF] doc1.pdf| 2.5 MB    | [Check] Indexed           | |
| |                               | | | [TXT] note.txt| 12 KB     | [Clock] Pending           | |
| |                               | | +-------------------------------------------------------+ |
| |                               | |                                                           | |
| |                               | | +-------------------------------------------------------+ |
| |                               | | | Training Progress                                     | |
| |                               | | | [===========================>           ] 70%         | |
| |                               | | | Processing: note.txt...                               | |
| |                               | | +-------------------------------------------------------+ |
| |                               | |                                                           | |
| |                               | |                                     [Start Embedding]   | |
| +-------------------------------+ +-----------------------------------------------------------+ |
+-----------------------------------+-----------------------------------------------------------+
```
