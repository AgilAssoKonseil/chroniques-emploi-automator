
import React, { useState } from 'react';

interface ScriptEditorProps {
  services: string;
  industrie: string;
  onSend: () => void;
  isSending: boolean;
  recipientEmail: string;
  date: string;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ services, industrie, onSend, isSending, recipientEmail, date }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'industrie'>('services');

  const handleExportWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Chronique Radio Sud Sarthe</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
        h1 { color: #4f46e5; text-transform: uppercase; border-bottom: 2px solid #4f46e5; }
        h2 { color: #1e293b; margin-top: 30px; border-left: 5px solid #4f46e5; padding-left: 10px; }
        .metadata { color: #64748b; font-size: 10pt; margin-bottom: 20px; }
        .script { font-size: 12pt; white-space: pre-wrap; }
      </style>
      </head>
      <body>
        <h1>CHRONIQUE EMPLOI - SUD SARTHE</h1>
        <div class="metadata">Édition du ${date} | Destinataire : ${recipientEmail}</div>
        
        <h2>🎧 BLOC 1 : SERVICES (01:30)</h2>
        <div class="script">${services}</div>
        
        <br clear=all style='mso-special-character:line-break;page-break-before:always'>
        
        <h2>🏭 BLOC 2 : INDUSTRIE (01:30)</h2>
        <div class="script">${industrie}</div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chronique_Radio_Sud_Sarthe_${date.replace(/\//g, '-')}.doc`;
    link.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl h-full flex flex-col overflow-hidden border-t-4 border-t-indigo-600 print:border-none print:shadow-none">
      {/* Header - Hidden on print */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white print:hidden">
        <div className="flex items-center">
          <div className="bg-indigo-50 p-2.5 rounded-2xl mr-3 text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-sm">Chronique Radio</h3>
            <div className="flex items-center mt-0.5">
               <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-indigo-50 px-1.5 rounded">{recipientEmail || "redaction@..."}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onSend}
          disabled={isSending || (!services && !industrie)}
          className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isSending 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'
          }`}
        >
          {isSending ? "Transmission..." : "Envoyer Mail"}
        </button>
      </div>

      {/* Tabs & Exports - Hidden on print */}
      <div className="px-4 mt-5 space-y-4 print:hidden">
        <div className="flex bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'services' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Services (1m30)
          </button>
          <button
            onClick={() => setActiveTab('industrie')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'industrie' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Industrie (1m30)
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleExportWord}
            disabled={!services && !industrie}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Exporter Word
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={!services && !industrie}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Imprimer PDF
          </button>
        </div>
      </div>

      {/* Script Viewport */}
      <div className="p-8 flex-1 overflow-y-auto bg-white print:overflow-visible print:p-0">
        {services || industrie ? (
          <div className="max-w-none">
            {/* Metadata shown only on print */}
            <div className="hidden print:block mb-8 border-b-2 border-indigo-600 pb-4">
               <h1 className="text-3xl font-black text-indigo-600 uppercase tracking-tighter">Sud Sarthe Radio</h1>
               <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Chronique Emploi du ${date}</p>
            </div>

            <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-4 print:hidden">
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  FORMAT 03:00 (500 MOTS)
                </span>
              </div>
            </div>

            {/* Print specific: Show both scripts one after another */}
            <div className="print:block hidden space-y-12">
               <div>
                 <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3 mb-4 uppercase">SERVICES (01:30)</h2>
                 <div className="font-serif text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">{services}</div>
               </div>
               <div className="page-break-before-always">
                 <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3 mb-4 uppercase">INDUSTRIE (01:30)</h2>
                 <div className="font-serif text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">{industrie}</div>
               </div>
            </div>

            {/* Screen View: Tabbed display */}
            <div className="print:hidden font-serif text-xl leading-[1.8] text-slate-800 whitespace-pre-wrap selection:bg-indigo-100">
              {activeTab === 'services' ? services : industrie}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4 print:hidden">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] leading-relaxed">
              En attente du scan des 30 annonces<br/>France Travail...
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #root, #root * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            visibility: visible;
          }
          .page-break-before-always {
            page-break-before: always;
            margin-top: 50px;
          }
        }
      `}} />
    </div>
  );
};
