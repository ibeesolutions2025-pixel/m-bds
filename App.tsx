import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { ApiKeySetup, ApiKeyManager } from './components/ApiKeySetup';
import { AppType } from './types';

const App: React.FC = () => {
  // State 'selectedApp' as requested to track the active application
  const [selectedApp, setSelectedApp] = useState<AppType>(AppType.BRANDING);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có API Key trong localStorage không
    const apiKey = localStorage.getItem('user_gemini_api_key');
    setHasApiKey(!!apiKey);
  }, []);

  const handleKeySet = () => {
    setHasApiKey(true);
  };

  // Nếu chưa có API Key, hiển thị màn hình setup
  if (!hasApiKey) {
    return <ApiKeySetup onKeySet={handleKeySet} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 overflow-hidden">
      <Sidebar selectedApp={selectedApp} onSelectApp={setSelectedApp} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <ApiKeyManager />
        </div>
        <Workspace selectedApp={selectedApp} />
      </div>
    </div>
  );
};

export default App;