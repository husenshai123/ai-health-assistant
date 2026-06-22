import React, { useState, useRef, useEffect } from 'react';

const HealthAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Health Assistant. Please describe your symptoms so I can assist you better.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  //backend call
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    
    // 1. display users msg on screen
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 2. send data to node.js backend (POST Request)
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await response.json();

      // 3. display ai's reply on screen
      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.text }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', text: 'Oops! Backend error: ' + data.error }]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setMessages((prev) => [...prev, { role: 'ai', text: 'Server se connect nahi ho pa raha hai. Check if backend is running.' }]);
    } finally {
      setIsTyping(false); // Off the typing animation
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans">
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 bg-slate-800 border-b border-slate-700 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 text-2xl">
            🩺
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-wide">AI Health Assistant</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm text-emerald-400 font-medium">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 shrink-0">AI</div>
            )}
            <div className={`relative max-w-[85%] sm:max-w-[70%] px-5 py-4 text-[15px] leading-relaxed shadow-md ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-tl-sm'}`}>
              {/* React Markdown waghera baad me laga sakte hain, abhi direct text render karenge */}
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold ml-3 mt-1 shrink-0">You</div>
            )}
          </div>
        ))}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex w-full justify-start items-center">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-3 shrink-0">AI</div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center shadow-md">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Form */}
      <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex gap-3 sm:gap-4 items-end bg-slate-800 p-2 sm:p-3 rounded-2xl border border-slate-700 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <input 
            type="text"
            className="flex-1 bg-transparent border-none text-slate-200 px-4 py-3 focus:outline-none placeholder-slate-500"
            placeholder="Type your health queries here..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isTyping || !inputValue.trim()}
            className="p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default HealthAssistant;