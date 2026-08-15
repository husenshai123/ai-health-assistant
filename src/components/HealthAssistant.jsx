import DiagnosticReport from './DiagnosticReport';
import React, { useState, useRef, useEffect } from 'react';

const formatTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Typewriter effect
const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 20); 
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const HealthAssistant = () => {
  const userName = localStorage.getItem('health_user') || 'Patient';

  const defaultGreeting = { 
    role: 'ai', 
    text: `Hello ${userName}! I am your AI Health Assistant. Please describe your symptoms or upload a medical report so I can assist you better.`,
    time: formatTime(),
    isStarred: false 
  };
  
  // NAYA: Ab initial state sirf default greeting rahegi, localStorage nahi
  const [messages, setMessages] = useState([defaultGreeting]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false); 
  const [isListening, setIsListening] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); 
  const fileInputRef = useRef(null); 

  // NAYA: Backend se Chat History fetch karne ka logic
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('health_token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/ai/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const historyData = await res.json();
          // Agar database me purani chat hai, toh usko set kar do
          if (historyData && historyData.length > 0) {
            setMessages(historyData);
          }
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []); // [] ka matlab hai ye sirf ek baar chalega jab component load hoga

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to securely log out?')) {
      localStorage.removeItem('health_token');
      localStorage.removeItem('health_user');
      window.location.reload(); 
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the screen? (Note: History is still saved in cloud)')) {
      const freshGreeting = { ...defaultGreeting, time: formatTime(), animate: true };
      setMessages([freshGreeting]);
      setInputValue('');
      setSelectedImage(null);
    }
  };

  const handleDeleteMessage = (indexToDelete) => {
    if (window.confirm('Are you sure you want to delete this message from view?')) {
      setMessages((prevMessages) => prevMessages.filter((_, index) => index !== indexToDelete));
    }
  };

  const handleToggleStar = (indexToStar) => {
    setMessages((prevMessages) => 
      prevMessages.map((msg, index) => 
        index === indexToStar ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          data: reader.result.split(',')[1], 
          mimeType: file.type,
          url: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const messageText = inputValue.trim() || "Analyze this image.";
    const newUserMessage = { 
      role: 'user', 
      text: messageText, 
      imageUrl: selectedImage ? selectedImage.url : null,
      time: formatTime(),
      isStarred: false 
    };
    
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
    const imageToSend = selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : null;
    
    setInputValue('');
    setSelectedImage(null); 
    setIsTyping(true);

    try {
        const token = localStorage.getItem('health_token');

        const res = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ message: messageText, image: imageToSend }),
        });

        const data = await res.json(); 

        if (!res.ok) {
            console.error("Server Error:", data.error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'ai', text: `Authentication Error: Please click 'Logout' and Login again to refresh your session.`, time: formatTime(), animate: true, isStarred: false }
            ]);
            setIsTyping(false);
            return;
        }

        if (data.isMedical) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'ai', isReport: true, reportData: data.reportData, time: formatTime(), isStarred: false }
            ]);
        } else {
            setMessages((prevMessages) => [
                ...prevMessages,
                { 
                  role: 'ai', 
                  isReport: false, 
                  text: data.generalResponse || `Here to help. What else can I assist with?`, 
                  time: formatTime(),
                  animate: true,
                  isStarred: false 
                }
            ]);
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'ai', text: "Sorry, I am facing some network issues right now.", time: formatTime(), animate: true, isStarred: false }
        ]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard! 📋');
  };

  const handleWhatsAppShare = (text) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExportChat = () => {
    const chatText = messages.map(m => 
      `${m.role === 'ai' ? 'Doctor AI' : userName} [${m.time || ''}]:\n${m.imageUrl ? '[Image Attached] ' : ''}${m.isReport ? '🏥 [Detailed Diagnostic Report Generated]' : m.text}`
    ).join('\n\n---------------------------------------\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userName.replace(/\s+/g, '_')}_Health_Report.txt`;
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
      
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-slate-800 border-b border-slate-700 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 text-blue-400 text-xl sm:text-2xl shadow-inner border border-blue-500/20">🩺</div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-wide">AI Health Assistant</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs sm:text-sm text-emerald-400 font-medium">System Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          
          <div className="hidden md:flex flex-col items-end mr-2 pr-4 border-r border-slate-700">
            <span className="text-sm font-bold text-slate-200 capitalize">{userName}</span>
            <span className="text-[10px] text-slate-400">Authenticated User</span>
          </div>

          <button onClick={handleExportChat} className="hidden sm:flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium py-2 px-4 rounded-xl transition-colors border border-slate-600 shadow-sm" title="Download chat history">
            📄 Export
          </button>
          
          <button onClick={handleClearChat} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:py-2 sm:px-4 gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-xl transition-colors border border-slate-600 shadow-sm" title="Clear screen">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          <button onClick={handleLogout} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:py-2 sm:px-4 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium rounded-xl transition-colors border border-red-500/20 shadow-sm" title="Secure Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {!msg.isReport && (
                <div className={`px-5 py-3 shadow-sm max-w-[85%] sm:max-w-[75%] transition-all ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
                } ${msg.isStarred ? 'ring-2 ring-yellow-400 shadow-md shadow-yellow-500/10' : ''}`}>
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="User uploaded" className="w-48 h-auto rounded-lg mb-2 border border-slate-600 object-cover" />
                  )}
                  {msg.role === 'ai' && msg.animate ? (
                    <Typewriter text={msg.text} />
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                  )}
                </div>
              )}

              {msg.isReport && (
                <div className={`max-w-[100%] sm:max-w-[85%] transition-all rounded-2xl ${msg.isStarred ? 'ring-2 ring-yellow-400 shadow-md shadow-yellow-500/10' : ''}`}>
                   <DiagnosticReport reportData={msg.reportData} />
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-1 px-1">
                {msg.time && <span className="text-[10px] text-slate-500">{msg.time}</span>}
                
                {msg.role === 'ai' && !msg.isReport && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleCopyText(msg.text)} className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" title="Copy message">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      Copy
                    </button>
                    
                    <button onClick={() => handleWhatsAppShare(msg.text)} className="text-[10px] flex items-center gap-1 text-green-500/80 hover:text-green-400 transition-colors cursor-pointer" title="Share on WhatsApp">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      Share
                    </button>
                  </div>
                )}

                <button onClick={() => handleToggleStar(index)} className={`text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${msg.isStarred ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`} title="Star message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={msg.isStarred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  {msg.isStarred ? 'Starred' : 'Star'}
                </button>

                <button onClick={() => handleDeleteMessage(index)} className="text-[10px] flex items-center gap-1 text-red-500/80 hover:text-red-400 transition-colors cursor-pointer" title="Delete message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Delete
                </button>

              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-start items-end gap-2">
               <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">AI</div>
              <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm h-[44px]">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {showScrollButton && (
          <button onClick={scrollToBottom} className="absolute bottom-4 right-4 sm:right-6 p-3 bg-slate-700/90 hover:bg-slate-600 text-slate-200 hover:text-white rounded-full shadow-lg backdrop-blur-sm transition-all z-20 border border-slate-600 flex items-center justify-center animate-fade-in" title="Scroll to latest message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
          </button>
        )}
      </div>

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
        
        {selectedImage && (
          <div className="max-w-5xl mx-auto mb-3">
             <div className="relative inline-block border border-slate-600 rounded-lg p-2 bg-slate-800 shadow-md">
                <img src={selectedImage.url} alt="Preview" className="h-16 w-auto rounded object-cover" />
                <button 
                  onClick={() => setSelectedImage(null)} 
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                  title="Remove Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto flex gap-2 sm:gap-4 items-end bg-slate-800 p-2 sm:p-3 rounded-2xl border border-slate-700 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isTyping}
            className="p-3 rounded-xl transition-colors flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 disabled:opacity-50"
            title="Attach a medical report or image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
          </button>

          <input 
            type="text"
            className="flex-1 bg-transparent border-none text-slate-200 px-2 py-3 focus:outline-none placeholder-slate-500"
            placeholder="Type your health queries..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping}
          />
          
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
            disabled={isTyping || (!inputValue.trim() && !selectedImage)}
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