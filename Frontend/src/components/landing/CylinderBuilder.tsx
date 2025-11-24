import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, Shield } from 'lucide-react';

interface CylinderProps {
  onConfigChange: (config: { inside: number; outside: number; skg: number }) => void;
}

export const CylinderBuilder: React.FC<CylinderProps> = ({ onConfigChange }) => {
  const [inside, setInside] = useState(30);
  const [outside, setOutside] = useState(30);
  const [skg, setSkg] = useState(3);

  useEffect(() => {
    onConfigChange({ inside, outside, skg });
  }, [inside, outside, skg, onConfigChange]);

  const lengths = [30, 35, 40, 45, 50, 55, 60, 65, 70];

  // Visual scaling factor
  const scale = 3; 

  return (
    <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200">
      <div className="text-center mb-4 md:mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Cilinder Configurator</h3>
        <p className="text-sm text-slate-500">Kies de lengte van de binnen- en buitenzijde.</p>
      </div>

      {/* Visual Representation - Scaled for mobile */}
      <div className="relative h-28 md:h-40 flex items-center justify-center mb-6 md:mb-10 perspective-1000 overflow-visible">
         {/* Wrapper for responsive scaling */}
         <div className="transform scale-[0.55] xs:scale-75 sm:scale-100 origin-center transition-transform duration-300">
             {/* The Cylinder Body */}
             <div className="relative flex items-center shadow-2xl drop-shadow-xl transition-all duration-500">
                
                {/* Inside Part */}
                <div 
                    className="h-16 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-l-lg border-y border-l border-slate-400 relative transition-all duration-300 flex items-center justify-center"
                    style={{ width: `${inside * scale}px` }}
                >
                    <span className="text-xs font-bold text-slate-500">{inside}mm</span>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-400/30 rounded-full"></div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Binnen</div>
                </div>

                {/* Cam / Screw Hole Center */}
                <div className="w-8 h-16 bg-slate-800 relative z-10 flex items-center justify-center border-x-2 border-slate-600">
                    <div className="w-4 h-4 rounded-full bg-black shadow-inner border border-slate-600"></div>
                    {/* Cam */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-6 bg-slate-700 rounded-b-lg origin-top transform -rotate-12 opacity-50"></div>
                </div>

                {/* Outside Part */}
                <div 
                    className="h-16 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-r-lg border-y border-r border-slate-400 relative transition-all duration-300 flex items-center justify-center"
                    style={{ width: `${outside * scale}px` }}
                >
                     <span className="text-xs font-bold text-slate-500">{outside}mm</span>
                     {/* Keyhole */}
                     <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-8 bg-slate-400/50 rounded-full flex flex-col items-center justify-center">
                        <div className="w-1 h-3 bg-slate-600 rounded-full mb-1"></div>
                        <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                     </div>
                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buiten</div>
                </div>

             </div>

             {/* Measurement Lines */}
             <div className="absolute -top-6 flex items-center space-x-2 text-slate-400 text-xs w-full justify-center">
                <ArrowLeftRight size={14} />
                <span>Totale lengte: {inside + outside} mm</span>
             </div>
         </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
        <div>
           <label className="block text-xs font-bold uppercase text-slate-500 mb-3">Binnenzijde (mm)</label>
           <div className="grid grid-cols-3 gap-1 md:gap-2">
              {lengths.map(l => (
                  <button 
                    key={`in-${l}`}
                    onClick={() => setInside(l)}
                    className={`px-1 py-2 text-[10px] md:text-xs font-bold rounded-md transition-all ${inside === l ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {l}
                  </button>
              ))}
           </div>
        </div>
        <div>
           <label className="block text-xs font-bold uppercase text-slate-500 mb-3">Buitenzijde (mm)</label>
           <div className="grid grid-cols-3 gap-1 md:gap-2">
              {lengths.map(l => (
                  <button 
                    key={`out-${l}`}
                    onClick={() => setOutside(l)}
                    className={`px-1 py-2 text-[10px] md:text-xs font-bold rounded-md transition-all ${outside === l ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {l}
                  </button>
              ))}
           </div>
        </div>
      </div>

      {/* Quality Selection */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div className="flex items-center">
            <Shield className="text-primary-600 mr-3" size={20} />
            <div>
               <div className="font-bold text-sm text-slate-900">Veiligheidsklasse</div>
               <div className="text-xs text-slate-500">Politiekeurmerk Veilig Wonen</div>
            </div>
         </div>
         <div className="flex space-x-2 w-full sm:w-auto">
             <button onClick={() => setSkg(2)} className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs font-bold border transition-colors ${skg === 2 ? 'bg-slate-800 text-white border-slate-800' : 'text-slate-400 border-slate-200'}`}>SKG**</button>
             <button onClick={() => setSkg(3)} className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs font-bold border transition-colors ${skg === 3 ? 'bg-slate-800 text-white border-slate-800' : 'text-slate-400 border-slate-200'}`}>SKG***</button>
         </div>
      </div>

      <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-start">
         <Check className="text-primary-600 w-5 h-5 mr-3 mt-0.5 shrink-0" />
         <p className="text-sm text-primary-900 leading-tight">
            Geselecteerd: <strong>{inside}/{outside}mm SKG{'*'.repeat(skg)}</strong>.<br/>
            <span className="text-primary-700 text-xs">Direct uit voorraad leverbaar.</span>
         </p>
      </div>
    </div>
  );
};

