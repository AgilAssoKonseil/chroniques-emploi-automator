
import React from 'react';

export const DeploymentGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Guide de Déploiement</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Chroniques Emploi Automator</p>
          </div>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <section className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[10px]">1</span>
              Obtenir votre Clé API
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>1. Connectez-vous sur <a href="https://aistudio.google.com/" target="_blank" className="text-indigo-600 font-bold underline">Google AI Studio</a>.</p>
              <p>2. Cliquez sur <b>"Get API key"</b> dans le menu de gauche.</p>
              <p>3. Cliquez sur <b>"Create API key"</b> pour générer votre code secret.</p>
              <p className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-700 font-medium">
                Note : Pour une radio associative, le plan gratuit est largement suffisant pour vos besoins quotidiens.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[10px]">2</span>
              Hébergement & Sécurité
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Déployez l'app sur <b>Vercel.com</b> (gratuit). Dans les paramètres du projet, ajoutez une "Environment Variable" nommée <code className="font-bold bg-slate-100 px-1">API_KEY</code> et collez votre clé. 
              Cela permet à l'app de fonctionner sans jamais dévoiler votre clé au public.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[10px]">3</span>
              Lancement
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Une fois déployée, votre URL (ex: <i>mavoix-emploi.vercel.app</i>) est prête à être utilisée par toute l'équipe rédactionnelle.
            </p>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
          >
            C'est noté !
          </button>
        </div>
      </div>
    </div>
  );
};
