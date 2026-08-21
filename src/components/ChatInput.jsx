import React from 'react';

const ChatInput = ({ inputValue, setInputValue, isTyping, isListening, selectedImage, setSelectedImage, handleImageUpload, handleSendMessage, handleVoiceInput, fileInputRef }) => {
  
  // NAYA LOGIC: Keyboard events handle karne ke liye
  const handleKeyDown = (e) => {
    // Agar sirf 'Enter' dabaya hai (bina Shift ke)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Nayi line banne se roko
      if (inputValue.trim() || selectedImage) {
        handleSendMessage(); // Message bhej do
      }
    }
    // Agar 'Shift + Enter' dabaya hai, toh default behavior chalega (nayi line aayegi)
  };

  // Textarea ki height dynamic rakhne ke liye line count nikal rahe hain
  const lineCount = inputValue.split('\n').length;
  const textareaRows = Math.min(lineCount, 5); // Max 5 lines tak bada hoga, uske baad scroll aayega

  return (
    <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 shrink-0">
      <div className="max-w-5xl mx-auto flex flex-wrap gap-2 mb-4">
        {['I have a fever', 'Tips for better sleep', 'Headache and nausea'].map((text, idx) => (
          <button key={idx} onClick={() => setInputValue(text)} disabled={isTyping} className="text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full border border-slate-700 transition-colors shadow-sm disabled:opacity-50">
            💡 {text}
          </button>
        ))}
      </div>
      
      {selectedImage && (
        <div className="max-w-5xl mx-auto mb-3">
           <div className="relative inline-block border border-slate-600 rounded-lg p-2 bg-slate-800 shadow-md">
              <img src={selectedImage.url} alt="Preview" className="h-16 w-auto rounded object-cover" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md">X</button>
           </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto flex gap-2 sm:gap-4 items-end bg-slate-800 p-2 sm:p-3 rounded-2xl border border-slate-700 focus-within:border-blue-500/50 focus-within:ring-4 transition-all">
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        <button onClick={() => fileInputRef.current.click()} disabled={isTyping} className="p-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700 disabled:opacity-50" title="Attach image">
           📎
        </button>

        {/* NAYA: <input> ko hata kar <textarea> lagaya hai */}
        <textarea 
          rows={textareaRows}
          className="flex-1 bg-transparent border-none text-slate-200 px-2 py-3 focus:outline-none placeholder-slate-500 resize-none custom-scrollbar"
          placeholder="Type your health queries... (Shift + Enter for new line)" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={handleKeyDown} 
          disabled={isTyping}
        />
        
        <button onClick={handleVoiceInput} disabled={isTyping} className={`p-3 rounded-xl flex items-center justify-center ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`} title="Voice typing">
          🎤
        </button>

        <button onClick={handleSendMessage} disabled={isTyping || (!inputValue.trim() && !selectedImage)} className="p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 shadow-md" title="Send message">
          ➤
        </button>
      </div>
      <div className="text-center mt-4 text-[10px] sm:text-xs text-slate-500 px-4">Disclaimer: This AI provides informational responses only.</div>
    </div>
  );
};

export default ChatInput;