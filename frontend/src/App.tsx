import React, { useState, useCallback, useEffect } from 'react';
import { ChatMessage, Role, UploadedFile, User, AppSettings } from './types';
import FileSidebar from './layouts/FileSidebar';
import ChatArea from './components/specific/ChatArea';
import LoginScreen from './pages/LoginScreen';
import AdminDashboard from './pages/AdminDashboard';
import { generateResponse } from './services/geminiService';
import { LogOut, Shield } from 'lucide-react';

const DEFAULT_SYSTEM_PROMPT = "You are a helpful research assistant called Lumina. You have access to the documents uploaded by the user. Always prioritize information found in the provided documents to answer questions. If the answer is not in the documents, rely on your general knowledge but mention that the document doesn't contain the specific info.";

const DEFAULT_SETTINGS: AppSettings = {
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  modelName: 'gemini-2.5-flash',
  allowGuestAccess: false,
  theme: 'dark',
  font: 'Inter',
  llmMode: 'balanced',
  fineTunedModelId: ''
};

const App: React.FC = () => {
  // Load Settings from LocalStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('lumina_app_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      console.error("Failed to load settings", e);
      return DEFAULT_SETTINGS;
    }
  });

  // Apply body styles dynamically
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.body.style.backgroundColor = '#0f172a'; // slate-900
      document.body.style.color = '#f8fafc';
    } else {
      document.body.style.backgroundColor = '#f9fafb'; // gray-50
      document.body.style.color = '#111827';
    }
  }, [settings.theme]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App View State
  const [view, setView] = useState<'chat' | 'admin'>('chat');

  // Data State
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('chat');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMessages([]);
    setFiles([]);
    setView('chat');
  };

  // Handle sending a message
  const handleSendMessage = useCallback(async (text: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
    };

    // Optimistic update
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Call Gemini Service with full settings object
      const responseText = await generateResponse(messages, text, files, settings);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "Sorry, I encountered an error processing your request. " + (error.message || ""),
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [files, messages, settings]);

  // Common Styles based on Theme
  const appFont = settings.font === 'Inter' ? 'Inter, sans-serif' : settings.font === 'Roboto' ? 'Roboto, sans-serif' : 'JetBrains Mono, monospace';

  // RENDER LOGIN SCREEN
  if (!currentUser) {
    return (
      <div style={{ fontFamily: appFont }}>
         <LoginScreen onLogin={handleLogin} theme={settings.theme} />
      </div>
    );
  }

  // RENDER ADMIN DASHBOARD
  if (view === 'admin') {
    return (
      <div style={{ fontFamily: appFont }} className="h-full">
        <AdminDashboard 
          settings={settings} 
          onUpdateSettings={setSettings} 
          onClose={() => setView('chat')} 
          files={files}
          onUpdateFiles={setFiles}
        />
      </div>
    );
  }

  // Logic to determine if sidebar should be visible
  // Viewers cannot see the file browsing tab
  const showSidebar = currentUser.role !== 'viewer';

  const isDark = settings.theme === 'dark';
  const bgClass = isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900';
  const navBgClass = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-gray-200 text-gray-900';

  // RENDER MAIN APP (CHAT)
  return (
    <div 
      className={`flex h-screen overflow-hidden flex-col md:flex-row ${bgClass}`}
      style={{ fontFamily: appFont }}
    >
      
      {/* Navigation Bar for Authenticated User (Desktop top right, Mobile top) */}
      <div className="fixed md:absolute top-0 right-0 z-50 p-4 flex items-center gap-3 pointer-events-none">
        <div className={`pointer-events-auto flex items-center gap-2 backdrop-blur border p-1.5 rounded-lg shadow-lg ${navBgClass}`}>
          <div className="flex items-center gap-2 px-2">
            <span className="text-xl">{currentUser.avatar}</span>
            <div className="flex flex-col">
              <span className={`text-xs font-bold leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser.username}</span>
              <span className="text-[10px] text-slate-400 uppercase leading-none mt-1">{currentUser.role}</span>
            </div>
          </div>

          <div className={`h-6 w-px mx-1 ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`}></div>

          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setView('admin')}
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md transition-colors"
              title="Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar - Only render if not a viewer */}
      {showSidebar && (
        <FileSidebar 
          files={files} 
          setFiles={setFiles} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          user={currentUser}
          theme={settings.theme}
        />
      )}

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full pt-16 md:pt-0 relative">
        <ChatArea 
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          hasFiles={files.length > 0}
          showSidebarControl={showSidebar}
          theme={settings.theme}
        />
      </main>
    </div>
  );
};

export default App;