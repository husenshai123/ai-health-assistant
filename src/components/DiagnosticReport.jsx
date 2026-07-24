import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const DiagnosticReport = ({ reportData }) => {
  const reportRef = useRef();

  // Naya Hook method
  const handleDownloadPdf = useReactToPrint({
    contentRef: reportRef,
    documentTitle: 'AI_Health_Report',
  });

  if (!reportData) return null;

  const { urgencyLevel, possibleConditions, suggestedSpecialist, homeRemedies, precautionarySteps, disclaimer } = reportData;

  const getBadgeStyle = (level) => {
    if (level === 'High') return 'bg-red-50 text-red-700 border border-red-200';
    if (level === 'Medium') return 'bg-orange-50 text-orange-700 border border-orange-200';
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

  return (
    <div ref={reportRef} className="max-w-3xl w-full mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-200 my-4 hover:shadow-md transition-shadow duration-300">
      
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🩺 AI Diagnostic Report
        </h2>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getBadgeStyle(urgencyLevel)}`}>
          Urgency: {urgencyLevel || 'Unknown'}
        </span>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-6">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Recommended Action</h3>
        <p className="text-lg font-bold text-blue-900">Consult: {suggestedSpecialist || 'General Physician'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
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

      <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <p className="text-xs text-red-500 font-medium italic max-w-lg">
          *Disclaimer: {disclaimer || 'This is an AI-generated report and not a substitute for professional medical advice.'}
        </p>
        
        {/* Simple button with onClick */}
        <button 
          onClick={() => handleDownloadPdf()}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
};

export default DiagnosticReport;