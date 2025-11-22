import React from 'react';
import { Users, Settings, Database } from 'lucide-react';
import { Theme } from '../../types';

interface AdminSidebarProps {
  activeTab: 'users' | 'settings' | 'rag';
  setActiveTab: (tab: 'users' | 'settings' | 'rag') => void;
  theme: Theme;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, theme }) => {
  const isDark = theme === 'dark';
  const sidebarClass = isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-100 border-gray-200';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';

  const getButtonClass = (tab: string) => `
    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all 
    ${activeTab === tab 
      ? 'bg-indigo-600 text-white' 
      : `${textMuted} hover:${isDark ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-900'}`
    }
  `;

  return (
    <div className={`w-48 border-r p-4 space-y-2 ${sidebarClass}`}>
      <button 
        onClick={() => setActiveTab('users')}
        className={getButtonClass('users')}
      >
        <Users className="w-4 h-4" />
        User Mgmt
      </button>
      <button 
        onClick={() => setActiveTab('settings')}
        className={getButtonClass('settings')}
      >
        <Settings className="w-4 h-4" />
        App Settings
      </button>
      <button 
        onClick={() => setActiveTab('rag')}
        className={getButtonClass('rag')}
      >
        <Database className="w-4 h-4" />
        RAG Training
      </button>
    </div>
  );
};

export default AdminSidebar;