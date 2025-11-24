import React from 'react';
import { Shield, Award, Users, Clock, History, Target } from 'lucide-react';
import { Reveal } from '@/components/landing/Reveal';

export const About: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Header */}
      <section className="pt-32 pb-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white rounded-[100%] blur-3xl opacity-60"></div>
        <Reveal>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8">
              Veiligheid is geen product.<br/> <span className="text-primary-600">Het is een belofte.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Al meer dan 15 jaar is BTD Beveiliging de betrouwbare partner voor complexe beveiligingsvraagstukken in de regio en daarbuiten.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary-100 rounded-[2.5rem] transform -rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" 
                  alt="BTD Team" 
                  className="relative rounded-[2rem] shadow-2xl w-full"
                />
              </div>
            </Reveal>
            
            <div>
              <Reveal delay={200}>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Ons Verhaal</h2>
                <div className="prose prose-lg text-slate-600">
                  <p className="mb-4">
                    BTD Beveiliging is ontstaan vanuit een passie voor techniek en veiligheid. Wat begon als een kleinschalig installatiebedrijf, is uitgegroeid tot een toonaangevende speler in de beveiligingsbranche.
                  </p>
                  <p className="mb-4">
                    Onze kracht ligt in de combinatie van bouwkundige maatregelen (hekwerken, sloten) en geavanceerde elektronische beveiliging (camera's, detectie). Wij geloven niet in standaardpakketten; elk pand en elk risico is uniek.
                  </p>
                  <p>
                    Wij zijn trots op onze VEB-erkenning. Dit betekent dat al onze installaties voldoen aan de strengste kwaliteitseisen en geaccepteerd worden door alle verzekeraars.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-2 gap-6 mt-12">
                 <Reveal delay={300}>
                   <div className="bg-slate-50 p-6 rounded-2xl">
                      <History className="h-8 w-8 text-primary-600 mb-3" />
                      <h4 className="font-bold text-slate-900">Ervaring</h4>
                      <p className="text-sm text-slate-600">Jarenlange expertise in diverse sectoren.</p>
                   </div>
                 </Reveal>
                 <Reveal delay={400}>
                   <div className="bg-slate-50 p-6 rounded-2xl">
                      <Target className="h-8 w-8 text-primary-600 mb-3" />
                      <h4 className="font-bold text-slate-900">Focus</h4>
                      <p className="text-sm text-slate-600">Resultaatgericht en persoonlijk advies.</p>
                   </div>
                 </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Reveal>
             <h2 className="text-3xl font-bold text-center mb-16">Waar wij voor staan</h2>
           </Reveal>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { icon: Shield, title: "VEB Erkend", desc: "Wij werken strikt volgens de VRKI en leveren een opleverbewijs of certificaat." },
               { icon: Clock, title: "24/7 Service", desc: "Storingen komen nooit gelegen. Onze servicedienst staat dag en nacht paraat." },
               { icon: Users, title: "Vakmanschap", desc: "Onze monteurs zijn gescreend en volgen continu bijscholing." },
               { icon: Award, title: "Kwaliteit", desc: "Wij werken uitsluitend met A-merken die hun betrouwbaarheid hebben bewezen." }
             ].map((item, i) => (
               <Reveal key={i} delay={i * 100}>
                 <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors h-full">
                   <item.icon size={40} className="text-primary-500 mb-6" />
                   <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                   <p className="text-slate-400 leading-relaxed">
                     {item.desc}
                   </p>
                 </div>
               </Reveal>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
};

