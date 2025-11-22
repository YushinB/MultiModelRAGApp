export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export type UserRole = 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  avatar?: string;
}

export type Theme = 'dark' | 'light' | 'system';
export type AppFont = 'Inter' | 'Roboto' | 'JetBrains Mono';
export type LLMMode = 'precise' | 'balanced' | 'creative';

export interface AppSettings {
  systemPrompt: string;
  modelName: string;
  allowGuestAccess: boolean;
  // Appearance
  theme: Theme;
  font: AppFont;
  // Model Config
  llmMode: LLMMode;
  fineTunedModelId?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export type RAGStatus = 'indexed' | 'pending' | 'failed';

export interface UploadedFile {
  id: string;
  name: string;
  mimeType: string;
  data: string; // Base64 encoded string
  size: number;
  status?: RAGStatus; // Added status
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}