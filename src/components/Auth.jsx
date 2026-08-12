import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLogin) {
        localStorage.setItem('health_token', data.token);
        localStorage.setItem('health_user', data.name);
        onLogin(data.token); // Token set karte hi chat screen khulegi
      } else {
        setIsLogin(true); 
        alert('Registration successful! Please login with your new account.');
        setFormData({ ...formData, password: '' }); // password clear kardo
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 text-blue-400 text-3xl">
            🩺
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Your Personal AI Health Assistant
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">Full Name</label>
              <input 
                type="text" name="name" required={!isLogin}
                value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
            <input 
              type="password" name="password" required
              value={formData.password} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;