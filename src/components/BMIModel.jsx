import React, { useState } from 'react';

const BMIModal = ({ isOpen, onClose }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  if (!isOpen) return null;

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      
      let category = '';
      let color = '';
      
      if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-400'; }
      else if (bmi >= 18.5 && bmi <= 24.9) { category = 'Normal Weight'; color = 'text-emerald-400'; }
      else if (bmi >= 25 && bmi <= 29.9) { category = 'Overweight'; color = 'text-yellow-400'; }
      else { category = 'Obese'; color = 'text-red-400'; }

      setBmiResult({ bmi, category, color });
    }
  };

  const handleClose = () => {
    setHeight('');
    setWeight('');
    setBmiResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-sm text-slate-200 border border-slate-700 shadow-2xl relative animate-fade-in">
        
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700 hover:bg-red-500 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-indigo-400">
          ⚖️ BMI Calculator
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Height (cm)</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              placeholder="e.g. 175" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="e.g. 70" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button 
            onClick={calculateBMI} 
            disabled={!height || !weight}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors mt-2"
          >
            Calculate BMI
          </button>
        </div>

        {bmiResult && (
          <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-700 text-center animate-fade-in">
            <p className="text-sm text-slate-400">Your BMI is</p>
            <p className="text-4xl font-bold text-white my-1">{bmiResult.bmi}</p>
            <p className={`text-sm font-semibold uppercase tracking-wider mt-2 ${bmiResult.color}`}>
              {bmiResult.category}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMIModal;