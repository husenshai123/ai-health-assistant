import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AnalyticsModal = ({ isOpen, onClose, messages }) => {
  if (!isOpen) return null;

  // Data Calculate karne ka Logic
  const urgencyCounts = { High: 0, Medium: 0, Low: 0 };
  let totalReports = 0;

  messages.forEach(msg => {
    if (msg.isReport && msg.reportData) {
      totalReports++;
      const level = msg.reportData.urgencyLevel || 'Low';
      if (urgencyCounts[level] !== undefined) {
        urgencyCounts[level]++;
      }
    }
  });

  // Recharts ke liye format kiya hua data
  const chartData = [
    { name: 'High Risk', value: urgencyCounts.High, color: '#ef4444' }, // Red
    { name: 'Medium Risk', value: urgencyCounts.Medium, color: '#f59e0b' }, // Yellow
    { name: 'Low Risk', value: urgencyCounts.Low, color: '#10b981' } // Green
  ].filter(item => item.value > 0); // Sirf wahi dikhao jinki value 0 se zyada ho

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-2xl text-slate-200 border border-slate-700 shadow-2xl relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700 hover:bg-red-500 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-blue-400">
          📊 Health Analytics Dashboard
        </h2>
        <p className="text-sm text-slate-400 mb-6">Based on your previous AI diagnostic reports</p>

        {totalReports === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-700">
            <span className="text-4xl block mb-3">📈</span>
            <p className="text-slate-400">No medical reports generated yet.</p>
            <p className="text-xs text-slate-500 mt-2">Chat with the AI about your symptoms to see your health trends.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Pie Chart Section */}
            <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center h-64">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Urgency Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart Section */}
            <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center h-64">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Report Count</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        <div className="mt-6 flex justify-between items-center bg-blue-900/20 border border-blue-500/20 p-3 rounded-lg">
          <span className="text-sm text-blue-300">Total Medical Reports Analyzed:</span>
          <span className="text-lg font-bold text-blue-400">{totalReports}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;