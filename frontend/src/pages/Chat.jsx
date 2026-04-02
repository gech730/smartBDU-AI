import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const res = await chatAPI.getHistory();
      if (res.data.length > 0) {
        setMessages(res.data.map(m => ({
          role: m.role,
          content: m.content
        })));
      } else {
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm SmartBDU AI, your intelligent campus assistant at Bahir Dar University. I'm here to help you with:

• **Department Selection** - Find the right major for you
• **Campus Life** - Tips for student success
• **Study Skills** - Effective learning strategies
• **Career Planning** - Job preparation and roadmap

What would you like to explore today?`
        }]);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setError('');

    try {
      const res = await chatAPI.sendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        await chatAPI.clearHistory();
        setMessages([{
          role: 'assistant',
          content: 'Chat history cleared. How can I help you today?'
        }]);
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl h-full flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-primary-500" />
              AI Assistant
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Powered by GPT-4</p>
          </div>
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="Clear chat history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 message-enter ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'assistant' 
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500' 
                  : 'bg-gray-200 dark:bg-slate-700'
              }`}>
                {msg.role === 'assistant' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <div className={`flex-1 max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  msg.role === 'assistant'
                    ? 'chat-bubble-ai'
                    : 'chat-bubble-user'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="chat-bubble-ai p-4 rounded-2xl">
                <div className="typing-indicator flex gap-1.5">
                  <span className="w-2 h-2 bg-white/70 rounded-full"></span>
                  <span className="w-2 h-2 bg-white/70 rounded-full"></span>
                  <span className="w-2 h-2 bg-white/70 rounded-full"></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about university, careers, departments..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;