import DiagnosticReport from './DiagnosticReport';
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
  // Apne purane handleSendMessage ko isse replace kar de:

const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 1. User ka message UI par add karna
    const newUserMessage = { role: 'user', text: inputValue };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // 2. Backend se data mangwana
    try {
        const res = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: newUserMessage.text }),
        });

        // 3. API se aaya JSON data receive karna
        const data = await res.json(); 

        // 4. AI ka response UI par add karna (as a report)
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
       {/* Jaha tera message map ho raha hai, usko is tareeqe se likh: */}
    {messages.map((msg, index) => (
    <div key={index} className={`message-wrapper ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
        
        {/* Agar message simple text hai (jaise first greeting message) */}
        {!msg.isReport && (
            <div className={`message-bubble ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.text}
            </div>
        )}

        {/* Agar message ek AI Report hai (JSON object) */}
        {msg.isReport && (
            <DiagnosticReport reportData={msg.reportData} />
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