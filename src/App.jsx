import React, { useState } from 'react';
import HealthAssistant from './components/HealthAssistant';
import Auth from './components/Auth';

function App() {
  // Check karo ki pehle se login hai ya nahi
  const [token, setToken] = useState(localStorage.getItem('health_token'));

  // Logout ka function (Optional, baad me Header me daal lenge)
  const handleLogout = () => {
    localStorage.removeItem('health_token');
    localStorage.removeItem('health_user');
    setToken(null);
  };

  return (
    <div>
      {/* Agar Logout button chahiye screen ke upar toh ise un-comment kar lena baad me */}
      {/* {token && (
        <button onClick={handleLogout} className="absolute top-5 right-40 z-50 bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      )} */}

      {token ? (
        <HealthAssistant /> 
      ) : (
        <Auth onLogin={setToken} />
      )}
    </div>
  );
}

export default App;