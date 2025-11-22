import React, { useState, useEffect } from 'react';
import { AppSettings, User, UserRole, Theme, AppFont, LLMMode } from '../types';
import { getUsers, addUser, removeUser } from '../services/authService';
import { Users, Settings, Save, Trash2, Plus, Shield, X, Type, Palette, Cpu, Sparkles } from 'lucide-react';

interface AdminDashboardProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, onUpdateSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  
  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('viewer');

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  // Sync local settings if props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername) {
      addUser(newUsername, newUserRole);
      setUsers(getUsers());
      setNewUsername('');
    }
  };

  const handleRemoveUser = (id: string) => {
    removeUser(id);
    setUsers(getUsers());
  };

  const handleSaveSettings = () => {
    // Save directly to localStorage to persist changes
    localStorage.setItem('lumina_app_settings', JSON.stringify(localSettings));
    
    // Update global state to reflect changes immediately without reload
    onUpdateSettings(localSettings);
    
    // Close dashboard to return to chat
    onClose();
  };

  const isDark = localSettings.theme === 'dark';
  
  // Dynamic classes
  const containerClass = isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900';
  const headerClass = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const sidebarClass = isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-100 border-gray-200';
  const cardClass = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const rowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50';

  return (
    <div className={`flex flex-col h-full font-sans ${containerClass}`}>
      {/* Header */}
      <div className={`h-16 flex items-center justify-between px-6 border-b ${headerClass}`}>
        <div className="flex items-center gap-3">
          <div className="bg-red-500/10 p-2 rounded-lg">
             <Shield className="w-5 h-5 text-red-400" />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Control Panel</h2>
        </div>
        <button onClick={onClose} className={`p-2 rounded-lg ${textMuted} hover:${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <div className={`w-48 border-r p-4 space-y-2 ${sidebarClass}`}>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : `${textMuted} hover:${isDark ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-900'}`
            }`}
          >
            <Users className="w-4 h-4" />
            User Mgmt
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : `${textMuted} hover:${isDark ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-900'}`
            }`}
          >
            <Settings className="w-4 h-4" />
            App Settings
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'users' ? (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Add User */}
              <div className={`rounded-xl border p-6 ${cardClass}`}>
                <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Plus className="w-4 h-4 text-indigo-400" /> Add New User
                </h3>
                <form onSubmit={handleAddUser} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className={`block text-xs mb-1 ${textMuted}`}>Username</label>
                    <input 
                      type="text" 
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none ${inputClass}`}
                      placeholder="username"
                    />
                  </div>
                  <div className="w-40">
                    <label className={`block text-xs mb-1 ${textMuted}`}>Role</label>
                    <select 
                      value={newUserRole}
                      onChange={e => setNewUserRole(e.target.value as UserRole)}
                      className={`w-full rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none ${inputClass}`}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add User
                  </button>
                </form>
              </div>

              {/* User List */}
              <div className={`rounded-xl border overflow-hidden ${cardClass}`}>
                <table className="w-full text-sm text-left">
                  <thead className={`${isDark ? 'bg-slate-950' : 'bg-gray-50'} ${textMuted} uppercase text-xs font-semibold`}>
                    <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-200'}`}>
                    {users.map(user => (
                      <tr key={user.id} className={rowHover}>
                        <td className={`px-6 py-4 font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <span className="text-lg">{user.avatar}</span> {user.username}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${user.role === 'admin' ? 'bg-red-400/10 text-red-400' : 
                              user.role === 'manager' ? 'bg-blue-400/10 text-blue-400' : 
                              'bg-green-400/10 text-green-600'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.username !== 'admin' && (
                            <button 
                              onClick={() => handleRemoveUser(user.id)}
                              className={`${textMuted} hover:text-red-400 transition-colors`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Appearance Settings */}
              <div className={`rounded-xl border p-6 ${cardClass}`}>
                <h3 className={`font-semibold mb-6 flex items-center gap-2 border-b pb-4 ${isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200'}`}>
                  <Palette className="w-4 h-4 text-indigo-400" /> Appearance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm mb-2 flex items-center gap-2 ${textMuted}`}>
                      <Type className="w-4 h-4" /> Application Font
                    </label>
                    <select 
                      value={localSettings.font}
                      onChange={e => setLocalSettings({...localSettings, font: e.target.value as AppFont})}
                      className={`w-full rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none ${inputClass}`}
                    >
                      <option value="Inter">Inter (Default)</option>
                      <option value="Roboto">Roboto</option>
                      <option value="JetBrains Mono">JetBrains Mono</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm mb-2 ${textMuted}`}>Theme Preference</label>
                     <select 
                      value={localSettings.theme}
                      onChange={e => setLocalSettings({...localSettings, theme: e.target.value as Theme})}
                      className={`w-full rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none ${inputClass}`}
                    >
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Model Settings */}
              <div className={`rounded-xl border p-6 ${cardClass}`}>
                <h3 className={`font-semibold mb-6 flex items-center gap-2 border-b pb-4 ${isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200'}`}>
                  <Cpu className="w-4 h-4 text-indigo-400" /> Model Configuration
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm mb-2 ${textMuted}`}>LLM Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['precise', 'balanced', 'creative'] as LLMMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setLocalSettings({...localSettings, llmMode: mode})}
                          className={`px-3 py-2 rounded-lg text-sm capitalize border transition-all ${
                            localSettings.llmMode === mode 
                              ? 'bg-indigo-600 text-white border-indigo-500' 
                              : `${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <p className={`text-xs mt-2 ${textMuted}`}>
                      {localSettings.llmMode === 'precise' && "Low temperature. Best for factual answers and data extraction."}
                      {localSettings.llmMode === 'balanced' && "Medium temperature. Good balance of coherence and creativity."}
                      {localSettings.llmMode === 'creative' && "High temperature. Best for brainstorming and storytelling."}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm mb-2 flex items-center gap-2 ${textMuted}`}>
                      <Sparkles className="w-4 h-4" /> Fine-Tuned Model ID <span className="text-xs opacity-70">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      value={localSettings.fineTunedModelId || ''}
                      onChange={e => setLocalSettings({...localSettings, fineTunedModelId: e.target.value})}
                      className={`w-full rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none font-mono ${inputClass}`}
                      placeholder="e.g., tunedModels/my-custom-model-123"
                    />
                    <p className={`text-xs mt-2 ${textMuted}`}>
                      Leave empty to use the default <strong>gemini-2.5-flash</strong> model.
                    </p>
                  </div>
                </div>
              </div>

              {/* System Prompt */}
              <div className={`rounded-xl border p-6 ${cardClass}`}>
                <h3 className={`font-semibold mb-4 flex items-center gap-2 border-b pb-4 ${isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200'}`}>
                  System Instructions
                </h3>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Prompt</label>
                <textarea 
                  value={localSettings.systemPrompt}
                  onChange={e => setLocalSettings({...localSettings, systemPrompt: e.target.value})}
                  className={`w-full h-40 rounded-lg p-4 text-sm focus:border-indigo-500 outline-none font-mono leading-relaxed ${inputClass}`}
                />
              </div>
              
              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 pb-8">
                <div className={`text-xs ${textMuted}`}>
                  Changes are saved automatically and applied immediately.
                </div>
                <button 
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;