import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/gemini';
import { ChatMessage } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

interface Props {
  topic: string;
}

const ChatTutor: React.FC<Props> = ({ topic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when component mounts or topic changes (optional reset)
  useEffect(() => {
    const systemPrompt = topic 
      ? `Bạn là một gia sư AI chuyên sâu về chủ đề "${topic}". Hãy trả lời ngắn gọn, súc tích và tập trung vào chủ đề này. Nếu người dùng hỏi ngoài lề, hãy khéo léo lái về chủ đề chính.`
      : `Bạn là một gia sư AI hữu ích. Bạn sẵn sàng giải đáp mọi thắc mắc học tập của người dùng.`;
      
    const session = createChatSession(systemPrompt);
    setChatSession(session);
    
    // Initial welcome message
    setMessages([{
      id: 'init',
      role: 'model',
      text: topic 
        ? `Chào bạn! Mình là gia sư AI. Bạn muốn tìm hiểu thêm gì về **${topic}** không?` 
        : `Chào bạn! Bạn cần mình giúp đỡ về môn học hay chủ đề nào hôm nay?`
    }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession || isSending) return;

    const userText = input;
    setInput('');
    setIsSending(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Stream response
      const result = await chatSession.sendMessageStream({ message: userText });
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', isLoading: true }]);

      let fullText = '';
      for await (const chunk of result) {
        const text = chunk.text();
        fullText += text;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText, isLoading: false } : msg
        ));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Xin lỗi, mình đang gặp chút sự cố kết nối. Bạn thử lại sau nhé!", 
        isLoading: false 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 rounded-full">
            <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
            <h3 className="font-semibold text-indigo-900">Trợ lý Gia sư</h3>
            <p className="text-xs text-indigo-500">Luôn sẵn sàng giải đáp 24/7</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-500'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              
              <div
                className={`p-3 rounded-2xl shadow-sm text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                 {msg.isLoading && !msg.text ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                 ) : (
                    <div className={msg.role === 'user' ? '' : 'markdown-body text-sm'}>
                        {msg.role === 'user' ? msg.text : <MarkdownRenderer content={msg.text} />}
                    </div>
                 )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={topic ? `Hỏi thêm về "${topic}"...` : "Hỏi bất cứ điều gì..."}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className={`p-2 rounded-full transition ${
              input.trim() && !isSending
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
            AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
        </p>
      </div>
    </div>
  );
};

export default ChatTutor;