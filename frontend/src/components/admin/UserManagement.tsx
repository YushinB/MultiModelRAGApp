import React, { useState } from 'react';
import { User, UserRole, Theme } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (username: string, role: UserRole) => void;
  onRemoveUser: (id: string) => void;
  theme: Theme;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onRemoveUser, theme }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('viewer');

  const isDark = theme === 'dark';
  const cardClass = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const rowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername) {
      onAddUser(newUsername, newUserRole);
      setNewUsername('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Add User */}
      <div className={`rounded-xl border p-6 ${cardClass}`}>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Plus className="w-4 h-4 text-indigo-400" /> Add New User
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
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
                      onClick={() => onRemoveUser(user.id)}
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
  );
};

export default UserManagement;