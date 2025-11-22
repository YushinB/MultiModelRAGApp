# Lumina RAG Workspace

## Description
Lumina RAG Workspace is a secure, interactive Retrieval-Augmented Generation (RAG) application designed to help users extract insights from their documents. Built with React, TypeScript, and Google's Gemini AI, it allows users to upload various file formats (PDF, Text, Images) and engage in natural language conversations with their content.

## Installation

### Frontend Setup
The frontend is built with React and Vite.

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` or `.env.local` file in the `frontend` directory with your API keys:
    ```env
    GEMINI_API_KEY=your_google_gemini_api_key
    PORT=3000 # Optional, defaults to 3000
    ```

## Usage

### Running the Frontend
You can start the frontend application using the provided PowerShell script or standard npm commands.

**Option 1: Using the Deployment Script (Windows)**
Run the automated script from the root directory to install dependencies and start the server on the configured port.
```powershell
.\deploy-frontend.ps1
```

**Option 2: Manual Start**
1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

### Accessing the Application
Once the server is running, open your web browser and navigate to:
http://localhost:3000 (or the port you specified)

### Login Credentials (Demo)
- **Admin**: `admin`
- **Manager**: `manager_jane`
- **Viewer**: `viewer_bob`
