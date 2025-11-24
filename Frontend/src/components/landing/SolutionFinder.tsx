import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2, Smartphone, Key, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { LandingButton } from './LandingButton';

type Step = 'type' | 'goal' | 'result';

export const SolutionFinder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('type');
  const [selections, setSelections] = useState({ type: '', goal: '' });

  const handleTypeSelect = (type: string) => {
    setSelections(prev => ({ ...prev, type }));
    setStep('goal');
  };

  const handleGoalSelect = (goal: string) => {
    setSelections(prev => ({ ...prev, goal }));
    setStep('result');
  };

  const reset = () => {
    setStep('type');
    setSelections({ type: '', goal: '' });
  };

  const getResult = () => {
    const { type, goal } = selections;
    
    if (goal === 'smart') {
      if (type === 'home') return {
        title: "Tedee PRO",
        desc: "De perfecte, onzichtbare oplossing voor uw woning. Geen sleutels meer nodig.",
        link: "/products/tedee",
        image: "https://www.btdbeveiliging.nl/site/assets/files/1035/tedee_pro.jpg"
      };
      return {
        title: "Tapkey & DOM",
        desc: "Flexibel sleutelbeheer voor uw bedrijf. Geef toegang via de app.",
        link: "/products/tapkey",
        image: "https://www.btdbeveiliging.nl/site/assets/files/1220/tapkey.png"
      };
    }
    
    if (goal === 'secure') {
      return {
        title: "SKG*** Meerpuntssluiting",
        desc: "Maximale mechanische inbraakbeveiliging met kerntrekbeslag.",
        link: "/services/sloten",
        image: "https://images.unsplash.com/photo-1558002038-109177381792?q=80&w=2070&auto=format&fit=crop"
      };
    }

    return {
      title: "Sluitsysteem op Maat",
      desc: "Beheer uw hele pand met één gecertificeerde sleutel.",
      link: "/services/sluitsystemen",
      image: "https://images.unsplash.com/photo-1517488970477-9c98a58f4c71?q=80&w=2069&auto=format&fit=crop"
    };
  };

  const result = getResult();

  return (
    <div className="w-full bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative border border-slate-700">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 -mr-20 -mt-20 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Beveiligingswijzer</h2>
            <p className="text-slate-400">Vind binnen 3 klikken de juiste oplossing.</p>
          </div>
          {step !== 'type' && (
            <button onClick={reset} className="text-slate-500 hover:text-white transition-colors flex items-center text-sm font-medium">
              <RefreshCw size={14} className="mr-2" /> Reset
            </button>
          )}
        </div>

        {/* Step 1: Type */}
        {step === 'type' && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-6">Wat wilt u beveiligen?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => handleTypeSelect('home')}
                className="group p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-primary-500 hover:bg-slate-750 transition-all text-left flex items-center"
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:bg-primary-600 flex items-center justify-center text-white mr-4 transition-colors">
                  <Home size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">Mijn Woning</div>
                  <div className="text-xs text-slate-400 mt-1">Woonhuis, appartement of villa</div>
                </div>
                <ArrowRight className="ml-auto text-slate-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
              </button>

              <button 
                onClick={() => handleTypeSelect('business')}
                className="group p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-primary-500 hover:bg-slate-750 transition-all text-left flex items-center"
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:bg-primary-600 flex items-center justify-center text-white mr-4 transition-colors">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">Mijn Bedrijf</div>
                  <div className="text-xs text-slate-400 mt-1">Kantoor, VvE of bedrijfspand</div>
                </div>
                <ArrowRight className="ml-auto text-slate-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 'goal' && (
          <div className="animate-fade-in-up">
            <h3 className="text-lg font-bold text-white mb-6">Wat is uw belangrijkste wens?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => handleGoalSelect('smart')}
                className="group p-5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-primary-500 hover:bg-slate-750 transition-all text-left"
              >
                <Smartphone size={28} className="text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-white mb-1">Geen sleutels</div>
                <div className="text-xs text-slate-400">Openen met telefoon</div>
              </button>

              <button 
                onClick={() => handleGoalSelect('secure')}
                className="group p-5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-primary-500 hover:bg-slate-750 transition-all text-left"
              >
                <ShieldCheck size={28} className="text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-white mb-1">Inbraakwerend</div>
                <div className="text-xs text-slate-400">SKG*** Politiekeurmerk</div>
              </button>

              <button 
                onClick={() => handleGoalSelect('control')}
                className="group p-5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-primary-500 hover:bg-slate-750 transition-all text-left"
              >
                <Key size={28} className="text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-white mb-1">Overzicht</div>
                <div className="text-xs text-slate-400">Wie heeft welke sleutel?</div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && (
          <div className="animate-fade-in-up flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center text-green-400 text-sm font-bold mb-4 bg-green-400/10 px-3 py-1 rounded-full">
                <CheckCircle2 size={14} className="mr-2" /> Beste keuze voor u
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-4">{result.title}</h3>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                {result.desc}
              </p>
              <div className="flex gap-4">
                <LandingButton onClick={() => navigate(result.link)} className="bg-primary-600 hover:bg-primary-500 text-white border-none">
                  Bekijk Product
                </LandingButton>
                <LandingButton variant="ghost" className="text-slate-300 hover:text-white" onClick={() => navigate('/contact')}>
                  Adviesgesprek
                </LandingButton>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-slate-700 relative group">
              <img src={result.image} alt={result.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

