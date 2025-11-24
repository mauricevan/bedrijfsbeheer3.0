import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { PRODUCT_DETAILS } from '@/data/landingData';
import { LandingButton as Button } from '@/components/landing/LandingButton';
import { Reveal } from '@/components/landing/Reveal';
import * as Icons from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = id ? PRODUCT_DETAILS[id] : undefined;

  if (!product) {
    return (
      <div className="pt-40 text-center pb-20 font-sans min-h-screen bg-white">
        <h1 className="text-2xl font-bold text-slate-900">Product niet gevonden</h1>
        <Button onClick={() => navigate('/')} className="mt-6">Terug naar home</Button>
      </div>
    );
  }

  // Dynamic Styles
  const accentColor = product.theme.primary;
  
  return (
    <div className={`min-h-screen font-sans bg-white`}>
      {/* Product Hero */}
      <div className={`relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden ${product.theme.gradient}`}>
        
        {/* Background blobs based on brand color */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ backgroundColor: accentColor }}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl opacity-10" style={{ backgroundColor: accentColor }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <button 
               onClick={() => navigate('/')} 
               className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
            >
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Terug
            </button>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Side */}
            <div className="order-2 lg:order-1">
              <Reveal delay={100}>
                <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6 text-sm font-bold tracking-wide" style={{ color: accentColor }}>
                   Officieel {product.brand} Partner
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1]">
                  {product.title}
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 font-light mb-10 leading-relaxed">
                  {product.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className={`${product.theme.accent} shadow-xl shadow-slate-300/50`}
                    onClick={() => navigate('/contact')}
                  >
                    Offerte Aanvragen
                  </Button>
                  <Button 
                    size="lg" 
                    variant="ghost"
                    className="border border-slate-200 hover:bg-white bg-white/50"
                  >
                    Brochure Downloaden <Download size={18} className="ml-2" />
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Image Side */}
            <div className="order-1 lg:order-2 flex justify-center perspective-1000">
              <Reveal delay={300}>
                 <div className="relative group">
                    <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="relative w-full max-w-md mx-auto drop-shadow-2xl transform transition-transform duration-700 hover:scale-105 hover:rotate-2"
                    />
                 </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
             <Reveal>
               <h2 className="text-3xl font-bold text-slate-900 mb-8">Waarom {product.brand}?</h2>
               <div className="prose prose-lg prose-slate max-w-none text-slate-600">
                  {product.fullDescription.map((paragraph, idx) => (
                    <p key={idx} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
               </div>
             </Reveal>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Reveal>
             <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16">
               Unieke Eigenschappen
             </h2>
           </Reveal>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {product.features.map((feature, idx) => {
               const IconComponent = (Icons as any)[feature.icon] || Icons.Star;
               return (
                 <Reveal key={idx} delay={idx * 100}>
                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full hover:shadow-xl transition-shadow duration-300">
                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg" style={{ backgroundColor: accentColor }}>
                       <IconComponent size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                     <p className="text-slate-600 leading-relaxed text-sm">
                       {feature.description}
                     </p>
                   </div>
                 </Reveal>
               )
             })}
           </div>
        </div>
      </section>

      {/* Specs & Info Split */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
             {/* Specs Table */}
             <Reveal>
               <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                 <ShieldCheck className="mr-3" style={{ color: accentColor }} /> 
                 Specificaties
               </h3>
               <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                 <div className="space-y-4">
                   {product.specs.map((spec, idx) => (
                     <div key={idx} className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-200 last:border-0">
                       <span className="font-semibold text-slate-500 mb-1 sm:mb-0">{spec.label}</span>
                       <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </Reveal>

             {/* CTA Box */}
             <Reveal delay={200}>
               <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden h-full flex flex-col justify-center">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                 
                 <h3 className="text-3xl font-bold mb-6 relative z-10">Interesse in {product.brand}?</h3>
                 <p className="text-slate-300 mb-8 leading-relaxed relative z-10">
                   Bezoek onze winkel in Dordrecht voor een live demonstratie. Wij hebben diverse modellen werkend opgesteld staan.
                 </p>
                 
                 <div className="space-y-4 relative z-10">
                   <div className="flex items-center">
                     <Check className="text-green-400 mr-3" size={20} />
                     <span className="font-medium">Direct uit voorraad leverbaar</span>
                   </div>
                   <div className="flex items-center">
                     <Check className="text-green-400 mr-3" size={20} />
                     <span className="font-medium">Installatie service mogelijk</span>
                   </div>
                   <div className="flex items-center">
                     <Check className="text-green-400 mr-3" size={20} />
                     <span className="font-medium">2 jaar garantie</span>
                   </div>
                 </div>

                 <Button 
                   onClick={() => navigate('/contact')} 
                   className="mt-10 w-full justify-center bg-white text-slate-900 hover:bg-slate-100 border-transparent"
                 >
                   Maak een Afspraak
                 </Button>
               </div>
             </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

