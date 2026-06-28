import React from 'react';

const DiagnosticReport = ({ reportData }) => {
  if (!reportData) return null;

  const { urgencyLevel, possibleConditions, suggestedSpecialist, homeRemedies, precautionarySteps, disclaimer } = reportData;

  // color is depend on urgency
  const badgeColor = 
    urgencyLevel === 'High' ? 'bg-red-500 text-white' : 
    urgencyLevel === 'Medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white';

  return (
    <div className="max-w-2xl w-full mx-auto p-5 bg-white rounded-xl shadow-lg border border-gray-100 mt-2 mb-4">
      {/* Header & Urgency Badge */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-lg font-bold text-gray-800">⚕️ AI Diagnostic Report</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${badgeColor}`}>
          Urgency: {urgencyLevel}
        </span>
      </div>

      {/* Suggested Specialist */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4">
        <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Recommended Action</h3>
        <p className="text-md font-bold text-blue-900 mt-1">Consult: {suggestedSpecialist}</p>
      </div>

      {/* Grid Layout for Conditions & Remedies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <h4 className="font-semibold text-gray-700 text-sm mb-2">🦠 Possible Conditions</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {possibleConditions?.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <h4 className="font-semibold text-gray-700 text-sm mb-2">🌿 Home Remedies</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {homeRemedies?.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      </div>

      {/* Precautions */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 text-sm mb-2">🛡️ Precautionary Steps</h4>
        <div className="flex flex-wrap gap-2">
          {precautionarySteps?.map((step, index) => (
            <span key={index} className="bg-gray-100 border text-gray-700 text-xs px-2 py-1 rounded-md">
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-red-500 font-medium italic border-t pt-3">
        *Disclaimer: {disclaimer}
      </p>
    </div>
  );
};

export default DiagnosticReport;