import DiagnosticReport from './DiagnosticReport';
import React, { useState, useRef, useEffect } from 'react';

const HealthAssistant = () => {
  // 1. Initial greeting message ko alag variable me rakha taaki reset karna aasan ho
  const defaultGreeting = { role: 'ai', text: 'Hello! I am your AI Health Assistant. Please describe your symptoms so I can assist you better.' };
  
  const [messages, setMessages] = useState([defaultGreeting]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 2. Chat clear karne ka naya function
  const handleClearChat = () => {
    setMessages([defaultGreeting]);
    setInputValue('');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage = { role: 'user', text: inputValue };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
        const res = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: newUserMessage.text }),
        });

        const data = await res.json(); 

        setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'ai', isReport: true, reportData: data }
        ]);

    } catch (error) {
        console.error("Error fetching AI response:", error);
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'ai', text: "Sorry, I am facing some network issues right now." }
        ]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans">
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 bg-slate-800 border-b border-slate-700 shadow-sm z-10 shrink-0">
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

        {/* 3. Naya "New Chat" Button */}
        <button 
          onClick={handleClearChat}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium py-2 px-4 rounded-xl transition-colors border border-slate-600 shadow-sm"
          title="Start a new conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          New Chat
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {/* Simple Text Messages */}
            {!msg.isReport && (
              <div className={`px-5 py-3 shadow-sm max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            )}

            {/* Diagnostic Report Message */}
            {msg.isReport && (
              <div className="max-w-[100%] sm:max-w-[85%]">
                 <DiagnosticReport reportData={msg.reportData} />
              </div>
            )}
            
          </div>
        ))}

        {/* Typing Animation UI */}
        {isTyping && (
          <div className="flex w-full justify-start items-end gap-2">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
            <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm h-[44px]">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Form */}
      <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 shrink-0">
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