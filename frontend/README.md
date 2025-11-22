# Lumina RAG Workspace

## Description
Lumina RAG Workspace is a secure, interactive Retrieval-Augmented Generation (RAG) application designed to help users extract insights from their documents. Built with React, TypeScript, and Google's Gemini AI, it allows users to upload various file formats (PDF, Text, Images) and engage in natural language conversations with their content.

Key features include:
- **AI-Powered Chat**: Ask questions and get answers based on your uploaded documents using Gemini 2.5 Flash.
- **Document Management**: Upload and manage files within a secure sidebar interface.
- **Role-Based Access Control**: Simulated authentication with Admin, Manager, and Viewer roles.
- **Admin Dashboard**: Manage users and configure application settings (System Prompt, LLM Mode, Theme).
- **Customizable UI**: Switch between Dark and Light modes, and choose your preferred font.

## Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder.

2.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Environment Setup**:
    Create a `.env` file in the `frontend` directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

## Usage

1.  **Start the development server**:
    ```bash
    npm run dev
    ```

2.  **Access the application**:
    Open your browser and navigate to `http://localhost:3000`.

3.  **Log In**:
    Use one of the demo accounts to sign in:
    -   **Admin**: `admin` (Full access to settings and user management)
    -   **Manager**: `manager_jane` (Can upload/remove files)
    -   **Viewer**: `viewer_bob` (Read-only access to chat)

4.  **Chat with your Data**:
    -   Upload a document using the sidebar.
    -   Type your question in the chat area.
    -   Lumina will analyze the document and provide an answer.
