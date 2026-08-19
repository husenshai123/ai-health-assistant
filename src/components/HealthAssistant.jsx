import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ProfileModal from './ProfileModal';
import AnalyticsModal from './AnalyticsModal';
import BMIModal from './BMIModal';

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const HealthAssistant = () => {
  const userName = localStorage.getItem('health_user') || 'Patient';
  const defaultGreeting = { role: 'ai', text: `Hello ${userName}! I am your AI Health Assistant. Please describe your symptoms or upload a medical report.`, time: formatTime(), isStarred: false };
  
  const [messages, setMessages] = useState([defaultGreeting]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false); 
  const [isListening, setIsListening] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isBMIOpen, setIsBMIOpen] = useState(false); 
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); 
  const fileInputRef = useRef(null); 

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('health_token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/ai/history', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const historyData = await res.json();
          if (historyData?.length > 0) setMessages(historyData);
        }
      } catch (error) { console.error(error); }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleLogout = () => {
    if (window.confirm('Securely log out?')) {
      localStorage.removeItem('health_token'); localStorage.removeItem('health_user'); window.location.reload(); 
    }
  };
  const handleClearChat = () => {
    if (window.confirm('Clear screen?')) { setMessages([{ ...defaultGreeting, animate: true }]); setInputValue(''); setSelectedImage(null); }
  };
  const handleDeleteMessage = (idx) => setMessages((prev) => prev.filter((_, index) => index !== idx));
  const handleToggleStar = (idx) => setMessages((prev) => prev.map((msg, index) => index === idx ? { ...msg, isStarred: !msg.isStarred } : msg));
  const handleCopyText = (text) => { navigator.clipboard.writeText(text); alert('Copied!'); };
  const handleWhatsAppShare = (text) => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  const handleExportChat = () => { /* Same logic as before */ };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage({ data: reader.result.split(',')[1], mimeType: file.type, url: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;
    const messageText = inputValue.trim() || "Analyze this image.";
    setMessages((prev) => [...prev, { role: 'user', text: messageText, imageUrl: selectedImage?.url, time: formatTime(), isStarred: false }]);
    const imageToSend = selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : null;
    
    setInputValue(''); setSelectedImage(null); setIsTyping(true);
    try {
        const token = localStorage.getItem('health_token');
        const res = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ message: messageText, image: imageToSend }),
        });
        const data = await res.json(); 
        if (!res.ok) throw new Error("Auth Error");
        
        if (data.isMedical) {
            setMessages((prev) => [...prev, { role: 'ai', isReport: true, reportData: data.reportData, time: formatTime(), isStarred: false }]);
        } else {
            setMessages((prev) => [...prev, { role: 'ai', isReport: false, text: data.generalResponse, time: formatTime(), animate: true, isStarred: false }]);
        }
    } catch (error) {
        setMessages((prev) => [...prev, { role: 'ai', text: "Network error or Auth failed.", time: formatTime(), animate: true, isStarred: false }]);
    } finally { setIsTyping(false); }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    setShowScrollButton(chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop - chatContainerRef.current.clientHeight < 100 ? false : true);
  };
  const handleVoiceInput = () => { /* Same SpeechRecognition logic */ };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans">
<Navbar 
  userName={userName} 
  onExport={handleExportChat} 
  onClear={handleClearChat} 
  onLogout={handleLogout} 
  onOpenProfile={() => setIsProfileOpen(true)} 
  onOpenAnalytics={() => setIsAnalyticsOpen(true)}
  onOpenBMI={() => setIsBMIOpen(true)}
/>      
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => (
            <MessageBubble key={index} msg={msg} index={index} handleCopyText={handleCopyText} handleWhatsAppShare={handleWhatsAppShare} handleToggleStar={handleToggleStar} handleDeleteMessage={handleDeleteMessage} />
          ))}
          {isTyping && <div className="text-slate-400 text-sm animate-pulse ml-2">AI is analyzing...</div>}
          <div ref={messagesEndRef} className="h-1" />
        </div>
        {showScrollButton && <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })} className="absolute bottom-4 right-6 p-3 bg-slate-700 text-slate-200 rounded-full shadow-lg">⬇</button>}
      </div>

      <ChatInput inputValue={inputValue} setInputValue={setInputValue} isTyping={isTyping} isListening={isListening} selectedImage={selectedImage} setSelectedImage={setSelectedImage} handleImageUpload={handleImageUpload} handleSendMessage={handleSendMessage} handleVoiceInput={handleVoiceInput} fileInputRef={fileInputRef} />
<ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} /> 
  <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
<AnalyticsModal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} messages={messages} />
     
     <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} /> 
      <AnalyticsModal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} messages={messages} />
      <BMIModal isOpen={isBMIOpen} onClose={() => setIsBMIOpen(false)} /></div>
  );
};

export default HealthAssistant;