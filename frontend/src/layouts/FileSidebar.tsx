import React, { useRef } from 'react';
import { UploadedFile, User, Theme } from '../types';
import { formatFileSize, processFiles } from '../utils/fileUtils';
import { Trash2, FileText, Image as ImageIcon, File as FileIcon, UploadCloud, X, Lock } from 'lucide-react';

interface FileSidebarProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  theme: Theme;
}

const FileSidebar: React.FC<FileSidebarProps> = ({ files, setFiles, isOpen, onClose, user, theme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canManageFiles = user?.role === 'admin' || user?.role === 'manager';
  const isDark = theme === 'dark';

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = await processFiles(event.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (id: string) => {
    if (canManageFiles) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const triggerUpload = () => {
    if (canManageFiles) {
      fileInputRef.current?.click();
    }
  };

  const getIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-400" />;
    return <FileIcon className="w-5 h-5 text-gray-400" />;
  };

  // Dynamic classes
  const sidebarBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-xl md:shadow-none';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const uploadBox = isDark 
    ? 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50' 
    : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50';
  const fileItem = isDark 
    ? 'bg-slate-800/50 hover:bg-slate-800 border-transparent hover:border-slate-700' 
    : 'bg-gray-50 hover:bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm';

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex md:flex-col ${sidebarBg}`}
    >
      {/* Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${textPrimary}`}>
          <span className="text-indigo-500">⚡</span> Knowledge Base
        </h2>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-indigo-500">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Upload Area */}
      <div className="p-4">
        {canManageFiles ? (
          <div 
            onClick={triggerUpload}
            className={`group border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${uploadBox}`}
          >
            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
            <p className={`text-sm font-medium group-hover:text-indigo-500 ${textMuted}`}>Click to upload</p>
            <p className={`text-xs mt-1 text-center ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>PDF, Images, Text</p>
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center opacity-75 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}
          >
            <Lock className="w-8 h-8 text-slate-400 mb-2" />
            <p className={`text-sm font-medium ${textMuted}`}>Read-Only Access</p>
            <p className={`text-xs mt-1 text-center ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>Viewer role cannot upload files</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept=".pdf,.txt,.md,.csv,image/*" 
          onChange={handleFileChange} 
        />
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          Active Documents ({files.length})
        </div>
        
        {files.length === 0 ? (
          <div className={`text-center py-10 px-2 text-sm ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
            {canManageFiles ? 'No files uploaded.\nUpload documents to chat with them.' : 'No documents available.\nAsk a manager to upload files.'}
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${fileItem}`}>
              <div className="shrink-0">
                {getIcon(file.mimeType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-gray-700'}`} title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {canManageFiles && (
                <button 
                  onClick={() => removeFile(file.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileSidebar;