import React, { useState } from 'react';
import { UploadedFile, Theme } from '../../types';
import { Database, FileText, CheckCircle, Clock, Play, Sparkles } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

interface RagTrainingProps {
  files: UploadedFile[];
  onUpdateFiles: (files: UploadedFile[]) => void;
  theme: Theme;
}

const RagTraining: React.FC<RagTrainingProps> = ({ files, onUpdateFiles, theme }) => {
  const [embeddingProgress, setEmbeddingProgress] = useState(0);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [currentProcessingFile, setCurrentProcessingFile] = useState('');

  const isDark = theme === 'dark';
  const cardClass = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const rowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50';

  const startEmbedding = () => {
    if (files.length === 0) return;
    setIsEmbedding(true);
    setEmbeddingProgress(0);

    // Simulate embedding process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmbeddingProgress(progress);
      
      // Simulate processing different files
      const fileIndex = Math.floor((progress / 100) * files.length);
      if (files[fileIndex]) {
        setCurrentProcessingFile(files[fileIndex].name);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsEmbedding(false);
        setEmbeddingProgress(100);
        setCurrentProcessingFile('Completed');
        
        // Update all files to indexed status
        const updatedFiles = files.map(f => ({ ...f, status: 'indexed' as const }));
        onUpdateFiles(updatedFiles);
      }
    }, 200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* RAG Training View */}
      <div className={`rounded-xl border p-6 ${cardClass}`}>
        <h3 className={`font-semibold mb-6 flex items-center gap-2 border-b pb-4 ${isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200'}`}>
          <Database className="w-4 h-4 text-indigo-400" /> RAG Knowledge Base Status
        </h3>

        {/* File List */}
        <div className="space-y-4 mb-8">
          <h4 className={`text-sm font-medium ${textMuted} uppercase tracking-wider`}>Uploaded Documents</h4>
          <div className={`rounded-lg border overflow-hidden ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
            {files.length === 0 ? (
              <div className={`p-8 text-center text-sm ${textMuted}`}>
                No documents uploaded yet.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className={`${isDark ? 'bg-slate-950' : 'bg-gray-50'} ${textMuted} uppercase text-xs font-semibold`}>
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-200'}`}>
                  {files.map((file, idx) => (
                    <tr key={file.id} className={rowHover}>
                      <td className={`px-4 py-3 font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <FileText className="w-4 h-4 text-indigo-400" /> {file.name}
                      </td>
                      <td className={`px-4 py-3 ${textMuted}`}>{formatFileSize(file.size)}</td>
                      <td className="px-4 py-3">
                        {file.status === 'indexed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                            <CheckCircle className="w-3 h-3" /> Indexed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Training Progress</h4>
              <p className={`text-xs mt-1 ${textMuted}`}>
                {isEmbedding ? `Processing: ${currentProcessingFile}` : 'Ready to start embedding process'}
              </p>
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {embeddingProgress}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className={`h-2 w-full rounded-full overflow-hidden mb-6 ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${embeddingProgress}%` }}
            />
          </div>

          <div className="flex justify-end">
            <button 
              onClick={startEmbedding}
              disabled={isEmbedding || files.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              {isEmbedding ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Embedding
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RagTraining;