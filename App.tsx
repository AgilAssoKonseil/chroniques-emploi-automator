
import React, { useState, useCallback, useMemo } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { JobTable } from './components/JobTable';
import { ScriptEditor } from './components/ScriptEditor';
import { DeploymentGuide } from './components/DeploymentGuide';
import { DailyAutomationResult, Territory } from './types';
import { fetchRealJobsWithSearch, generateRadioScripts } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<DailyAutomationResult>({
    date: new Date().toLocaleDateString('fr-FR'),
    offers: [],
    scriptServices: '',
    scriptIndustrie: '',
    status: 'idle'
  });

  const [showGuide, setShowGuide] = useState(false);

  // Multiple Territories
  const [territories, setTerritories] = useState<Territory[]>([
    { id: 'default', city: 'Pontvallain', radius: 30 }
  ]);
  const [cityInput, setCityInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(20);

  const [partnerSources, setPartnerSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("redaction@radio-territoriale.fr");
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");

  const addTerritory = () => {
    if (cityInput.trim()) {
      const newT: Territory = {
        id: Math.random().toString(36).substring(7),
        city: cityInput.trim(),
        radius: radiusInput
      };
      setTerritories(prev => [...prev, newT]);
      setCityInput("");
    }
  };

  const removeTerritory = (id: string) => {
    setTerritories(prev => prev.filter(t => t.id !== id));
  };

  const addSource = () => {
    if (newSource.trim()) {
      setPartnerSources(prev => [...prev, newSource.trim()]);
      setNewSource("");
    }
  };

  const removeSource = (index: number) => {
    setPartnerSources(prev => prev.filter((_, i) => i !== index));
  };

  const territorySummary = useMemo(() => {
    return territories.map(t => t.city).join(' / ');
  }, [territories]);

  const runAutomation = useCallback(async () => {
    if (territories.length === 0) {
      setShowToast("Veuillez ajouter au moins une ville.");
      return;
    }

    setData(prev => ({ ...prev, status: 'running', offers: [] }));
    setLoadingStep("Scan web en cours (Grounding)...");
    
    try {
      const realJobs = await fetchRealJobsWithSearch(territories, partnerSources);
      
      if (realJobs.length === 0) {
        setData(prev => ({ ...prev, status: 'completed', offers: [] }));
        setLoadingStep("");
        setShowToast("Aucune offre trouvée.");
        return;
      }

      setLoadingStep("Analyse et rédaction des scripts...");
      const scripts = await generateRadioScripts(realJobs, territorySummary);

      const updatedJobs = realJobs.map(job => ({
        ...job,
        isFeatured: scripts.featuredIds.includes(job.id)
      }));

      setData(prev => ({
        ...prev,
        offers: updatedJobs,
        scriptServices: scripts.services,
        scriptIndustrie: scripts.industrie,
        status: 'completed'
      }));

      setLoadingStep("");
      setShowToast("Chroniques prêtes !");
      setTimeout(() => setShowToast(null), 5000);
    } catch (error) {
      console.error("Automation failed:", error);
      setData(prev => ({ ...prev, status: 'error' }));
      setLoadingStep("");
      setShowToast("Erreur lors de la génération.");
    }
  }, [territories, partnerSources, territorySummary]);

  const handleSendEmail = useCallback(() => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setShowToast("Erreur : Email destinataire invalide.");
      return;
    }

    setIsSending(true);

    const subject = encodeURIComponent(`CHRONIQUE EMPLOI - SECTEUR ${territorySummary.toUpperCase()} - ${data.date}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nVoici les chroniques prêtes pour l'antenne sur le secteur : ${territorySummary}.\n\n` +
      `------------------------------------------\n` +
      `🎧 CHRONIQUE 1 : EMPLOI SERVICES (1m30)\n` +
      `------------------------------------------\n\n` +
      `${data.scriptServices}\n\n\n` +
      `------------------------------------------\n` +
      `🏭 CHRONIQUE 2 : EMPLOI INDUSTRIE (1m30)\n` +
      `------------------------------------------\n\n` +
      `${data.scriptIndustrie}\n\n` +
      `------------------------------------------\n` +
      `Cordialement,\nL'Automate Chroniques Emploi`
    );

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSending(false);
      setShowToast(`Ouverture de la messagerie...`);
      setTimeout(() => setShowToast(null), 5000);
    }, 1000);
  }, [recipientEmail, data, territorySummary]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 print:bg-white relative">
      <div className="print:hidden">
        <DashboardHeader />
      </div>

      {/* DEPLOYMENT INFO BUTTON */}
      <button 
        onClick={() => setShowGuide(true)}
        className="fixed top-4 right-4 z-[60] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors print:hidden"
      >
        Aide Déploiement
      </button>

      {showGuide && <DeploymentGuide onClose={() => setShowGuide(false)} />}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full print:p-0 print:max-w-none">
        
        {/* MULTI-CONFIG ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 print:hidden">
          
          {/* GESTION DES TERRITOIRES */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-t-4 border-t-indigo-600">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Territoires Couverts
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Nouvelle Ville</label>
                  <input 
                    type="text" 
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Le Mans..."
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Rayon ({radiusInput} km)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" min="5" max="100" step="5"
                      value={radiusInput}
                      onChange={(e) => setRadiusInput(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <button onClick={addTerritory} className="bg-indigo-600 text-white p-2 rounded-xl">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {territories.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                  <div className="flex items-center">
                    <div className="bg-white p-1.5 rounded-lg mr-3 shadow-sm">
                      <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-700 uppercase">{t.city}</span>
                      <span className="text-[9px] font-bold text-slate-400 ml-2 uppercase">+{t.radius}km</span>
                    </div>
                  </div>
                  <button onClick={() => removeTerritory(t.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* EMAIL */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Email Diffusion</h3>
            <input 
              type="email" 
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="redaction@votre-radio.fr"
            />
            <p className="text-[9px] text-slate-400 mt-4 leading-relaxed italic">
              Un email contenant les scripts finaux sera automatiquement préparé pour cette adresse.
            </p>
          </div>

          {/* SOURCES */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sources</h3>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] outline-none"
                placeholder="Nouveau site..."
              />
              <button onClick={addSource} className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase">Ok</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100">France Travail</span>
              {partnerSources.map((s, i) => (
                <span key={i} onClick={() => removeSource(i)} className="text-[8px] cursor-pointer hover:bg-red-50 hover:text-red-500 font-black bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-500 uppercase">{s} ×</span>
              ))}
            </div>
          </div>
        </div>

        {/* HERO ACTIONS */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
          <div className="relative">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
              Chroniques Emploi<br/><span className="text-indigo-600">Automator</span>
            </h2>
            <div className="flex flex-wrap items-center mt-3 gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest bg-slate-200 px-2 py-1 rounded text-slate-600">{data.date}</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 truncate max-w-xs">{territorySummary || "Aucune zone"}</span>
            </div>
          </div>
          
          <button
            onClick={runAutomation}
            disabled={data.status === 'running' || territories.length === 0}
            className={`px-12 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex flex-col items-center gap-1 ${
              data.status === 'running' || territories.length === 0 ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <span className="flex items-center gap-3">
              {data.status === 'running' && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              )}
              {data.status === 'running' ? "Action en cours..." : "Scanner le Territoire"}
            </span>
            {loadingStep && (
              <span className="text-[8px] font-bold opacity-80 animate-pulse">{loadingStep}</span>
            )}
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 print:hidden">
            <JobTable offers={data.offers} />
          </div>

          <div className="lg:col-span-5 h-[calc(100vh-25rem)] sticky top-24 print:static print:h-auto print:col-span-12">
            <ScriptEditor 
              services={data.scriptServices} 
              industrie={data.scriptIndustrie} 
              onSend={handleSendEmail}
              isSending={isSending}
              recipientEmail={recipientEmail}
              date={data.date}
            />
          </div>
        </div>
      </main>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 print:hidden">
          <div className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center border border-slate-700 backdrop-blur-md">
            <div className="bg-indigo-500 p-2 rounded-full mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-black uppercase tracking-widest text-[11px]">{showToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
