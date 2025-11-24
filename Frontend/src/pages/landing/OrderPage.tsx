import React, { useState } from 'react';
import { Camera, Key, Lock, ArrowRight, MessageCircle, Info, ShoppingCart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/landing/Reveal';
import { LandingButton as Button } from '@/components/landing/LandingButton';
import { CylinderBuilder } from '@/components/landing/CylinderBuilder';
import { CONTACT_INFO } from '@/data/landingData';

type OrderType = 'keys' | 'cylinder' | 'spray';

export const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderType>('keys');
  const [cylinderConfig, setCylinderConfig] = useState({ inside: 30, outside: 30, skg: 3 });

  // Simulate Add to Cart / Order Action
  const handleOrder = (product: string) => {
    // In a real app, this would add to cart or checkout.
    // For this demo, we'll open a WhatsApp link with the pre-filled message.
    const message = `Hallo BTD, ik wil graag bestellen: ${product}.`;
    const url = `https://wa.me/${CONTACT_INFO.phone.replace(/-/g, '').replace('0', '31')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6">
              <ShoppingCart size={14} className="mr-2" /> Direct Bestellen
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Snel Service</h1>
            <p className="text-xl text-slate-600 font-light">
              Bestel direct sleutels, cilinders of onderhoudsproducten. Zonder offerte, direct geregeld.
            </p>
          </div>
        </Reveal>

        {/* Tab Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
           <button 
             onClick={() => setActiveTab('keys')}
             className={`px-8 py-4 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'keys' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
           >
             <Key className="mr-3" />
             <div className="text-left">
               <div className="font-bold">Sleutel Bijbestellen</div>
               <div className="text-xs opacity-70">Op basis van foto/code</div>
             </div>
           </button>

           <button 
             onClick={() => setActiveTab('cylinder')}
             className={`px-8 py-4 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'cylinder' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
           >
             <Lock className="mr-3" />
             <div className="text-left">
               <div className="font-bold">Nieuwe Cilinder</div>
               <div className="text-xs opacity-70">Op maat gemaakt</div>
             </div>
           </button>
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto">
          
          {/* KEYS SECTION */}
          {activeTab === 'keys' && (
            <Reveal>
              <div className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-2xl">
                 <div className="order-2 md:order-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Sleutel nabestellen?</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                       Het identificeren van de juiste sleutel kan lastig zijn. De snelste manier is via een foto.
                    </p>
                    
                    <div className="space-y-6">
                       <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold mr-4 shrink-0">1</div>
                          <div>
                             <h4 className="font-bold text-slate-900">Maak een duidelijke foto</h4>
                             <p className="text-sm text-slate-500">Zorg dat de kop van de sleutel en eventuele nummers goed leesbaar zijn.</p>
                          </div>
                       </div>
                       <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold mr-4 shrink-0">2</div>
                          <div>
                             <h4 className="font-bold text-slate-900">Stuur via WhatsApp</h4>
                             <p className="text-sm text-slate-500">Onze experts kijken direct mee of we deze uit voorraad kunnen maken.</p>
                          </div>
                       </div>
                       <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold mr-4 shrink-0">3</div>
                          <div>
                             <h4 className="font-bold text-slate-900">Betaal & Haal op (of verzenden)</h4>
                             <p className="text-sm text-slate-500">U ontvangt een betaallink. Vaak dezelfde dag nog klaar.</p>
                          </div>
                       </div>
                    </div>

                    <div className="mt-10">
                       <Button 
                         onClick={() => handleOrder('Foto van sleutel')}
                         className="w-full justify-center bg-[#25D366] hover:bg-[#128C7E] text-white border-none py-4 text-lg"
                       >
                          <Camera className="mr-2" /> Start WhatsApp met Foto
                       </Button>
                       <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center">
                          <Info size={12} className="mr-1" />
                          Geen WhatsApp? <a href="mailto:info@btdbeveiliging.nl" className="underline ml-1 hover:text-slate-900">Mail de foto</a>
                       </p>
                    </div>
                 </div>

                 <div className="order-1 md:order-2 relative h-64 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2098&auto=format&fit=crop" 
                      alt="Keys" 
                      className="w-full h-full object-cover mix-blend-multiply opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl text-center max-w-xs">
                          <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">8000+</div>
                          <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Soorten Sleutels</div>
                       </div>
                    </div>
                 </div>
              </div>
            </Reveal>
          )}

          {/* CYLINDER SECTION */}
          {activeTab === 'cylinder' && (
            <Reveal>
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                 <div className="lg:col-span-7">
                    <CylinderBuilder onConfigChange={setCylinderConfig} />
                 </div>
                 
                 <div className="lg:col-span-5">
                    <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-28">
                       <h2 className="text-2xl font-bold text-slate-900 mb-6">Uw Bestelling</h2>
                       
                       <div className="space-y-4 mb-8">
                          <div className="flex justify-between py-3 border-b border-slate-50">
                             <span className="text-slate-500">Type</span>
                             <span className="font-bold text-slate-900">Euro Profielcilinder</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-slate-50">
                             <span className="text-slate-500">Maatvoering</span>
                             <span className="font-bold text-slate-900">{cylinderConfig.inside}/{cylinderConfig.outside}mm</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-slate-50">
                             <span className="text-slate-500">Keurmerk</span>
                             <div className="flex items-center">
                                <ShieldCheck size={16} className="text-primary-600 mr-1" />
                                <span className="font-bold text-slate-900">SKG {cylinderConfig.skg}*</span>
                             </div>
                          </div>
                          <div className="flex justify-between py-3 border-b border-slate-50">
                             <span className="text-slate-500">Aantal sleutels</span>
                             <span className="font-bold text-slate-900">3 Standaard</span>
                          </div>
                       </div>

                       <div className="bg-green-50 p-4 rounded-xl flex items-center mb-8">
                          <CheckCircle2 className="text-green-600 mr-3 shrink-0" />
                          <p className="text-sm text-green-800">Vandaag besteld, morgen in huis (indien voorraad).</p>
                       </div>

                       <Button 
                          onClick={() => handleOrder(`Cilinder ${cylinderConfig.inside}/${cylinderConfig.outside}mm SKG${cylinderConfig.skg}`)}
                          className="w-full justify-center py-4 text-lg shadow-xl shadow-primary-500/20"
                       >
                          Direct Bestellen <ArrowRight className="ml-2" />
                       </Button>
                    </div>
                 </div>
              </div>
            </Reveal>
          )}

        </div>
      </div>
    </div>
  );
};

