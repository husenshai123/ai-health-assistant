import React from 'react';

// Renders the AI diagnostic report with a professional enterprise UI
  const DiagnosticReport = ({ reportData }) => {
  // Returns nothing if the data is missing to prevent crashes
  if (!reportData) return null;

  // Extracting all required fields from the JSON object
  const { urgencyLevel, possibleConditions, suggestedSpecialist, homeRemedies, precautionarySteps, disclaimer } = reportData;

  // Dynamically sets the badge style based on the severity level
  const getBadgeStyle = (level) => {
    if (level === 'High') return 'bg-red-50 text-red-700 border border-red-200';
    if (level === 'Medium') return 'bg-orange-50 text-orange-700 border border-orange-200';
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-200 my-4 hover:shadow-md transition-shadow duration-300">
      
      {/* Header Section with Urgency Badge */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🩺 AI Diagnostic Report
        </h2>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getBadgeStyle(urgencyLevel)}`}>
          Urgency: {urgencyLevel || 'Unknown'}
        </span>
      </div>

      {/* Recommended Specialist Section */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-6">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Recommended Action</h3>
        <p className="text-lg font-bold text-blue-900">Consult: {suggestedSpecialist || 'General Physician'}</p>
      </div>

      {/* Grid Layout for Conditions & Remedies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        
        {/* Possible Conditions Box */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <h4 className="font-bold text-gray-700 text-md mb-3 flex items-center gap-2">
            🦠 Possible Conditions
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            {possibleConditions?.length > 0 ? (
              possibleConditions.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No specific conditions identified.</li>
            )}
          </ul>
        </div>

        {/* Home Remedies Box */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <h4 className="font-bold text-gray-700 text-md mb-3 flex items-center gap-2">
            🌿 Home Remedies
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            {homeRemedies?.length > 0 ? (
              homeRemedies.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No specific home remedies suggested.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Precautionary Steps Section */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-700 text-md mb-3">🛡️ Precautionary Steps</h4>
        <div className="flex flex-wrap gap-2">
          {precautionarySteps?.length > 0 ? (
            precautionarySteps.map((step, index) => (
              <span key={index} className="bg-gray-100 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg">
                {step}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No precautions listed.</span>
          )}
        </div>
      </div>

      {/* Footer Area: Disclaimer & Action Buttons */}
      <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-xs text-red-500 font-medium italic max-w-lg">
          *Disclaimer: {disclaimer || 'This is an AI-generated report and not a substitute for professional medical advice.'}
        </p>
        
        {/* Placeholder button for the upcoming PDF feature */}
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
          📄 Download PDF
        </button>
      </div>
    </div>
  );
};

export default DiagnosticReport;