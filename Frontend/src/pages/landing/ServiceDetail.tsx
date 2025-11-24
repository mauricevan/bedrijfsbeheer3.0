import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { SERVICES, FEATURED_PRODUCTS } from '@/data/landingData';
import { LandingButton as Button } from '@/components/landing/LandingButton';
import { Reveal } from '@/components/landing/Reveal';
import * as Icons from 'lucide-react';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const service = SERVICES.find(s => s.slug === slug);
  const relatedProducts = FEATURED_PRODUCTS.filter(p => p.link.includes(slug || ''));

  if (!service) {
    return (
      <div className="pt-40 text-center pb-20 font-sans">
        <h1 className="text-2xl font-bold text-slate-900">Dienst niet gevonden</h1>
        <Button onClick={() => navigate('/services')} className="mt-6">Terug naar overzicht</Button>
      </div>
    );
  }

  const IconComponent = (Icons as any)[service.icon] || Icons.Shield;

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16">
            <Reveal>
               <button onClick={() => navigate('/services')} className="flex items-center text-sm font-bold text-white/70 hover:text-white mb-8 transition-colors group">
                  <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  Terug naar overzicht
               </button>
               <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6">{service.title}</h1>
               <p className="text-xl text-slate-300 max-w-2xl font-light leading-relaxed border-l-4 border-primary-500 pl-6">
                 {service.shortDescription}
               </p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
           
           {/* Main Content */}
           <div className="lg:col-span-8">
             <Reveal>
               <div className="prose prose-lg prose-slate max-w-none">
                 <h3 className="text-3xl font-bold text-slate-900 mb-6">Omschrijving</h3>
                 <p className="text-lg text-slate-600 leading-relaxed mb-10">
                   {service.fullDescription}
                 </p>
               </div>
             </Reveal>

             {/* Specific Products Blocks (like Plura/Sirius) if they match this service */}
             {relatedProducts.length > 0 && (
               <div className="space-y-12 mt-16">
                 <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4">Uitgelichte Systemen</h3>
                 {relatedProducts.map((prod) => (
                   <Reveal key={prod.id}>
                     <div className="bg-slate-50 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 border border-slate-100 hover:border-primary-200 transition-colors">
                       <div className="w-full md:w-48 h-48 bg-white rounded-2xl p-4 shrink-0 flex items-center justify-center shadow-sm">
                         <img src={prod.image} alt={prod.title} className="max-w-full max-h-full object-contain" />
                       </div>
                       <div>
                         <h4 className="text-xl font-bold text-slate-900 mb-2">{prod.title}</h4>
                         <p className="text-slate-600 text-sm mb-4 leading-relaxed">{prod.description}</p>
                         <div className="flex flex-wrap gap-2">
                           {prod.features.map(f => (
                             <span key={f} className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600">{f}</span>
                           ))}
                         </div>
                       </div>
                     </div>
                   </Reveal>
                 ))}
               </div>
             )}

             <Reveal delay={200}>
               <div className="mt-16 bg-gradient-to-br from-primary-50 to-white rounded-[2.5rem] p-10 border border-primary-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                    <ShieldCheck className="mr-3 text-primary-600" /> Waarom kiezen voor BTD?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                          <CheckCircle className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="text-slate-800 font-semibold">{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                          <CheckCircle className="h-4 w-4 text-primary-600" />
                        </div>
                      <span className="text-slate-800 font-semibold">43 jaar ervaring</span>
                    </div>
                  </div>
               </div>
             </Reveal>
           </div>

           {/* Sidebar */}
           <div className="lg:col-span-4 space-y-8">
             <Reveal delay={300} className="sticky top-28">
               <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-6">
                    <HelpCircle size={24} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">Vraag of Advies?</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Wij helpen u graag met het kiezen van de juiste beveiliging voor uw situatie.
                  </p>
                  
                  <div className="space-y-3">
                    <Button onClick={() => navigate('/contact')} className="w-full justify-center py-4 text-lg">
                      Contact Opnemen
                    </Button>
                    <a 
                      href="tel:0786148148"
                      className="flex items-center justify-center w-full py-4 rounded-full border-2 border-slate-100 font-bold text-slate-600 hover:border-slate-300 transition-colors"
                    >
                      Bel 078-614 81 48
                    </a>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-400 font-medium text-center">
                      Di t/m Vr: 08:00 - 17:00
                    </p>
                  </div>
               </div>
             </Reveal>
           </div>
        </div>
      </div>
    </div>
  );
};

