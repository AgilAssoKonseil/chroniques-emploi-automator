
import React from 'react';
import { JobOffer, JobCategory } from '../types';

interface JobTableProps {
  offers: JobOffer[];
}

export const JobTable: React.FC<JobTableProps> = ({ offers }) => {
  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col max-h-[700px]">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
        <div>
          <h3 className="font-bold text-slate-800">Flux des 15 dernières annonces</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">5-7 derniers jours • Territoires configurés</p>
        </div>
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          {offers.length} OFFRES
        </span>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Poste / Catégorie</th>
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Employeur</th>
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {offers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-400 italic font-medium">
                  Aucune donnée disponible. Cliquez sur "Scanner le Territoire".
                </td>
              </tr>
            ) : (
              offers.map((job) => (
                <tr key={job.id} className={`group transition-all ${job.isFeatured ? 'bg-amber-50/70 hover:bg-amber-100/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-bold text-slate-500">{job.date}</div>
                    {job.isFeatured && (
                      <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500 text-white uppercase tracking-tighter">
                        FOCUS RADIO
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-tight">
                      {job.category} • {job.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 font-semibold">{job.employer}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                    >
                      Voir
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
