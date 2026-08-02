import DiagnosticReport from './DiagnosticReport';
import React, { useState, useRef, useEffect } from 'react';

const formatTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const HealthAssistant = () => {
  const defaultGreeting = { 
    role: 'ai', 
    text: 'Hello! I am your AI Health Assistant. Please describe your symptoms so I can assist you better.',
    time: formatTime()
  };
  
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('health_chat_history');
    return savedMessages ? JSON.parse(savedMessages) : [defaultGreeting];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [showScrollButton, setShowScrollButton] = useState(false); 
  // NAYA STATE: Mic track karne ke liye
  const [isListening, setIsListening] = useState(false); 
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem('health_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to start a new chat? Your current history will be deleted.')) {
      const freshGreeting = { ...defaultGreeting, time: formatTime() };
      setMessages([freshGreeting]);
      localStorage.removeItem('health_chat_history');
      setInputValue('');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage = { role: 'user', text: inputValue, time: formatTime() };
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

        if (data.isMedical) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'ai', isReport: true, reportData: data.reportData, time: formatTime() }
            ]);
        } else {
            setMessages((prevMessages) => [
                ...prevMessages,
                { 
                  role: 'ai', 
                  isReport: false, 
                  text: data.generalResponse || "Hello! I am your AI Health Assistant. How can I help you today?", 
                  time: formatTime() 
                }
            ]);
        }

    } catch (error) {
        console.error("Error fetching AI response:", error);
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'ai', text: "Sorry, I am facing some network issues right now.", time: formatTime() }
        ]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard! 📋');
  };

  const handleExportChat = () => {
    const chatText = messages.map(m => 
      `${m.role === 'ai' ? 'Doctor AI' : 'Patient'} [${m.time || ''}]:\n${m.isReport ? '🏥 [Detailed Diagnostic Report Generated]' : m.text}`
    ).join('\n\n---------------------------------------\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My_Health_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // NAYA FUNCTION: Voice Input handle karne ke liye
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice input.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setInputValue(prev => (prev + " " + currentTranscript).trim());
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
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
      
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportChat}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium py-2 px-4 rounded-xl transition-colors border border-slate-600 shadow-sm"
            title="Download chat history"
          >
            📄 Export
          </button>
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
        </div>
      </header>

      {/* Wrapper Div */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        
        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {!msg.isReport && (
                <div className={`px-5 py-3 shadow-sm max-w-[85%] sm:max-w-[75%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              )}

              {msg.isReport && (
                <div className="max-w-[100%] sm:max-w-[85%]">
                   <DiagnosticReport reportData={msg.reportData} />
                </div>
              )}
              
              <div className="flex items-center gap-3 mt-1 px-1">
                {msg.time && (
                  <span className="text-[10px] text-slate-500">
                    {msg.time}
                  </span>
                )}
                
                {msg.role === 'ai' && !msg.isReport && (
                  <button
                    onClick={() => handleCopyText(msg.text)}
                    className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    title="Copy message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}

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

        {/* Floating Scroll Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 sm:right-6 p-3 bg-slate-700/90 hover:bg-slate-600 text-slate-200 hover:text-white rounded-full shadow-lg backdrop-blur-sm transition-all z-20 border border-slate-600 flex items-center justify-center animate-fade-in"
            title="Scroll to latest message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"/>
              <path d="m19 12-7 7-7-7"/>
            </svg>
          </button>
        )}
      </div>

      {/* Input Form Section */}
      <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 mb-4">
          {['I have a fever', 'Tips for better sleep', 'Headache and nausea'].map((text, index) => (
            <button
              key={index}
              onClick={() => setInputValue(text)}
              disabled={isTyping}
              className="text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full border border-slate-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💡 {text}
            </button>
          ))}
        </div>

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
          
          {/* NAYA: Mic Button Add Kiya */}
          <button
            onClick={handleVoiceInput}
            disabled={isTyping}
            className={`p-3 rounded-xl transition-colors flex items-center justify-center ${
              isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
            title="Speak your symptoms"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>

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

        <div className="text-center mt-4 text-[10px] sm:text-xs text-slate-500 px-4">
          <span className="font-semibold text-slate-400">Disclaimer:</span> This AI provides informational responses only. Please consult a certified doctor for medical emergencies.
        </div>
      </div>

    </div>
  );
};

export default HealthAssistant;