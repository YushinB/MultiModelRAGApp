import React, { useState, useEffect } from 'react';
import { AppSettings, User, UploadedFile } from '../types';
import { getUsers, addUser, removeUser } from '../services/authService';
import { Shield, X } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import AppSettingsView from '../components/admin/AppSettings';
import RagTraining from '../components/admin/RagTraining';

interface AdminDashboardProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClose: () => void;
  files: UploadedFile[];
  onUpdateFiles: (files: UploadedFile[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, onUpdateSettings, onClose, files, onUpdateFiles }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'rag'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  // Sync local settings if props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleAddUser = (username: string, role: any) => {
    addUser(username, role);
    setUsers(getUsers());
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
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';

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
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={localSettings.theme} 
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'users' ? (
            <UserManagement 
              users={users} 
              onAddUser={handleAddUser} 
              onRemoveUser={handleRemoveUser} 
              theme={localSettings.theme} 
            />
          ) : activeTab === 'settings' ? (
            <AppSettingsView 
              localSettings={localSettings} 
              setLocalSettings={setLocalSettings} 
              onSave={handleSaveSettings} 
              theme={localSettings.theme} 
            />
          ) : (
            <RagTraining 
              files={files} 
              onUpdateFiles={onUpdateFiles} 
              theme={localSettings.theme} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;