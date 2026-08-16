import React, { useState, useEffect } from 'react';
import DiagnosticReport from './DiagnosticReport';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20); 
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}</span>;
};

const MessageBubble = ({ msg, index, handleCopyText, handleWhatsAppShare, handleToggleStar, handleDeleteMessage }) => {
  return (
    <div className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
      {!msg.isReport && (
        <div className={`px-5 py-3 shadow-sm max-w-[85%] sm:max-w-[75%] transition-all ${
          msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
        } ${msg.isStarred ? 'ring-2 ring-yellow-400 shadow-md shadow-yellow-500/10' : ''}`}>
          {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" className="w-48 h-auto rounded-lg mb-2 border border-slate-600 object-cover" />}
          {msg.role === 'ai' && msg.animate ? <Typewriter text={msg.text} /> : <span className="whitespace-pre-wrap">{msg.text}</span>}
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
            <button onClick={() => handleCopyText(msg.text)} className="text-[10px] text-slate-500 hover:text-slate-300">Copy</button>
            <button onClick={() => handleWhatsAppShare(msg.text)} className="text-[10px] text-green-500/80 hover:text-green-400">Share</button>
          </div>
        )}
        <button onClick={() => handleToggleStar(index)} className={`text-[10px] ${msg.isStarred ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}>{msg.isStarred ? 'Starred' : 'Star'}</button>
        <button onClick={() => handleDeleteMessage(index)} className="text-[10px] text-red-500/80 hover:text-red-400">Delete</button>
      </div>
    </div>
  );
};

export default MessageBubble;