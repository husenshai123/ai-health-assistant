import React, { useState, useEffect } from 'react';

const ProfileModal = ({ isOpen, onClose }) => {
    const [profile, setProfile] = useState({ age: '', gender: '', medicalHistory: '' });

    useEffect(() => {
        if(isOpen) {
            fetch('http://localhost:5000/api/ai/profile', { headers: { 'Authorization': `Bearer ${localStorage.getItem('health_token')}` }})
            .then(res => res.json()).then(data => setProfile({ age: data.age || '', gender: data.gender || '', medicalHistory: data.medicalHistory || '' }));
        }
    }, [isOpen]);

    const handleSave = async () => {
        await fetch('http://localhost:5000/api/ai/profile', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('health_token')}` },
            body: JSON.stringify(profile)
        });
        alert('Profile Context Saved to Database!');
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl w-96 text-white border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Patient Profile (AI Context)</h2>
                <input type="number" placeholder="Age" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full bg-slate-700 p-2 rounded mb-3" />
                <select value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value})} className="w-full bg-slate-700 p-2 rounded mb-3">
                    <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option>
                </select>
                <textarea placeholder="Pre-existing Conditions (e.g., Diabetes, Asthma)" value={profile.medicalHistory} onChange={e => setProfile({...profile, medicalHistory: e.target.value})} className="w-full bg-slate-700 p-2 rounded mb-4 h-24" />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-600 rounded hover:bg-slate-500">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Save to Cloud</button>
                </div>
            </div>
        </div>
    );
};
export default ProfileModal;