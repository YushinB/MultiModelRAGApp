import React from 'react';
import { AppSettings, Theme, AppFont, LLMMode } from '../../types';
import { Palette, Type, Cpu, Sparkles, Save } from 'lucide-react';

interface AppSettingsProps {
  localSettings: AppSettings;
  setLocalSettings: (settings: AppSettings) => void;
  onSave: () => void;
  theme: Theme;
}

const AppSettingsView: React.FC<AppSettingsProps> = ({ localSettings, setLocalSettings, onSave, theme }) => {
  const isDark = theme === 'dark';
  const cardClass = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';

  return (
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
          onClick={onSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default AppSettingsView;