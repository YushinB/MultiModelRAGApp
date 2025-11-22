import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Role, Theme } from '../../types';
import { Send, Loader2, User, Bot, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onOpenSidebar: () => void;
  hasFiles: boolean;
  showSidebarControl: boolean;
  theme: Theme;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage, 
  onOpenSidebar, 
  hasFiles,
  showSidebarControl,
  theme
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === 'dark';

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Dynamic Classes
  const bgClass = isDark ? 'bg-slate-950' : 'bg-white';
  const headerClass = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-gray-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-500' : 'text-gray-400';
  const emptyStateIconBg = isDark ? 'bg-slate-800' : 'bg-gray-100';
  const emptyStateTitle = isDark ? 'text-slate-300' : 'text-gray-700';
  const botBubbleClass = isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-gray-100 text-gray-800 border-gray-200';
  const userAvatarBg = isDark ? 'bg-slate-700' : 'bg-gray-200';
  const inputAreaBg = isDark ? 'bg-slate-950 border-slate-800/50' : 'bg-white border-gray-200';
  const inputFieldClass = isDark ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400';

  return (
    <div className={`flex-1 flex flex-col h-full relative ${bgClass}`}>
      {/* Mobile Header */}
      <div className={`md:hidden h-16 flex items-center px-4 border-b backdrop-blur sticky top-0 z-30 ${headerClass}`}>
        {showSidebarControl && (
          <button 
            onClick={onOpenSidebar}
            className="text-indigo-500 text-sm font-medium flex items-center gap-2"
          >
            <span className="p-1 bg-indigo-500/10 rounded">📂 Files</span>
          </button>
        )}
        <span className={`font-semibold ${textPrimary} ${!showSidebarControl ? 'ml-0' : 'ml-auto'}`}>Lumina</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className={`flex flex-col items-center justify-center h-full opacity-60 mt-[-50px] ${textMuted}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-pulse ${emptyStateIconBg}`}>
              <Bot className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className={`text-xl font-medium mb-2 ${emptyStateTitle}`}>How can I help?</h3>
            <p className="text-sm max-w-md text-center">
              {hasFiles 
                ? "Ask questions about the documents in the database." 
                : "I can analyze PDFs, images, and text files once they are uploaded."}
            </p>
            {!hasFiles && showSidebarControl && (
              <p className="mt-4 text-xs text-amber-500/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Start by uploading a file
              </p>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar - Bot */}
            {msg.role === Role.MODEL && (
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 mt-1">
                <Bot className="w-5 h-5 text-indigo-500" />
              </div>
            )}

            {/* Bubble */}
            <div 
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm border ${
                msg.role === Role.USER 
                  ? 'bg-indigo-600 text-white rounded-br-none border-transparent' 
                  : `${botBubbleClass} rounded-bl-none`
              } ${msg.isError ? 'border-red-500/50 bg-red-900/10 text-red-400' : ''}`}
            >
              {msg.isError && (
                 <div className="flex items-center gap-2 mb-1 text-red-400 text-xs font-bold uppercase tracking-wide">
                   <AlertCircle className="w-3 h-3" /> Error
                 </div>
              )}
              <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                {msg.role === Role.MODEL ? (
                   <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className={isDark ? 'text-slate-200' : 'text-gray-800'} {...props} />,
                      code: ({node, ...props}) => <code className={isDark ? 'bg-slate-900' : 'bg-gray-200 text-gray-900'} {...props} />
                    }}
                   >
                     {msg.text}
                   </ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>

            {/* Avatar - User */}
            {msg.role === Role.USER && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${userAvatarBg}`}>
                <User className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start animate-in fade-in duration-300">
             <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Bot className="w-5 h-5 text-indigo-500" />
              </div>
            <div className={`rounded-2xl rounded-bl-none px-5 py-4 border flex flex-col gap-2 min-w-[120px] ${botBubbleClass}`}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                </div>
                {hasFiles && (
                  <span className="text-xs text-indigo-400 font-medium animate-pulse flex items-center gap-1.5">
                     Reading docs...
                  </span>
                )}
              </div>
              {hasFiles && (
                 <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div className="h-full bg-indigo-500/50 w-1/2 animate-[shimmer_1s_infinite_linear] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}></div>
                 </div>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${inputAreaBg}`}>
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit} className={`relative flex items-end gap-2 rounded-xl border focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-lg ${inputFieldClass}`}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasFiles ? "Ask questions about your documents..." : (showSidebarControl ? "Upload a document to start chatting..." : "Waiting for documents...")}
              className={`w-full bg-transparent px-4 py-3.5 min-h-[52px] max-h-[160px] resize-none focus:outline-none rounded-xl ${isDark ? 'text-slate-200 placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors shadow-md"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <div className="text-center mt-2">
            <p className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
              Lumina RAG uses Gemini 2.5 Flash. Documents are processed in the browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;