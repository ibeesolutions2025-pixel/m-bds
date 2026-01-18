import React, { useState, useEffect } from 'react';

interface ApiKeySetupProps {
  onKeySet: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    
    // Validate API Key format
    if (!trimmedKey) {
      setError('Vui lòng nhập API Key!');
      return;
    }
    
    if (!trimmedKey.startsWith('AIza')) {
      setError('API Key không hợp lệ! API Key phải bắt đầu bằng "AIza"');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('user_gemini_api_key', trimmedKey);
    setError('');
    onKeySet();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔑</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Cấu hình API Key
          </h2>
          <p className="text-gray-600">
            Để sử dụng app, bạn cần tạo API Key miễn phí từ Google AI Studio
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="font-semibold text-blue-800 mb-3">
            📋 Hướng dẫn lấy API Key:
          </p>
          <ol className="space-y-2 text-sm text-blue-900">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>
                Truy cập:{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  https://aistudio.google.com/app/apikey
                </a>
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Đăng nhập bằng tài khoản Google của bạn</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Click nút <strong>"Create API Key"</strong> hoặc <strong>"Get API Key"</strong></span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Copy API Key (bắt đầu bằng "AIza...")</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">5.</span>
              <span>Dán API Key vào ô bên dưới</span>
            </li>
          </ol>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key của bạn:
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError('');
            }}
            placeholder="Dán API Key vào đây (VD: AIzaSy...)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">❌ {error}</p>
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          💾 Lưu và Bắt đầu
        </button>

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="font-semibold text-yellow-800 mb-2">
            ⚠️ Lưu ý quan trọng:
          </p>
          <ul className="text-sm text-yellow-900 space-y-1">
            <li>• API Key của bạn chỉ lưu trên trình duyệt này (không gửi đến server)</li>
            <li>• Mỗi tài khoản Google có 60 requests/phút miễn phí</li>
            <li>• Đừng chia sẻ API Key với người khác</li>
            <li>• Nếu xóa cache trình duyệt, bạn cần nhập lại</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ApiKeyManager: React.FC = () => {
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('user_gemini_api_key');
    setCurrentKey(key);
  }, []);

  const handleChangeKey = () => {
    if (confirm('Bạn có chắc muốn đổi API Key?')) {
      localStorage.removeItem('user_gemini_api_key');
      window.location.reload();
    }
  };

  if (!currentKey) return null;

  const maskedKey = currentKey.substring(0, 12) + '...' + currentKey.substring(currentKey.length - 4);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🔑</div>
        <div>
          <p className="text-xs text-gray-600 font-medium">API Key đang dùng:</p>
          <code className="text-sm font-mono text-gray-800">
            {showKey ? currentKey : maskedKey}
          </code>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowKey(!showKey)}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
        >
          {showKey ? '👁️ Ẩn' : '👁️ Hiện'}
        </button>
        <button
          onClick={handleChangeKey}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
        >
          🔄 Đổi Key
        </button>
      </div>
    </div>
  );
};
