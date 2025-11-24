import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/data/landingData';
import { Reveal } from '@/components/landing/Reveal';
import * as Icons from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <div className="pt-24 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="bg-slate-50 pb-24 pt-20 border-b border-slate-100">
        <Reveal>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Onze Diensten</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              Van een eenvoudige reservesleutel tot complexe digitale toegangssystemen.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-32">
          {SERVICES.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Shield;
            const isEven = index % 2 === 0;

            return (
              <Reveal key={service.id} delay={100} className="scroll-mt-32" id={service.slug}>
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                  
                  {/* Image Side - Tapkey Style Rounded Card */}
                  <div className={`lg:w-1/2 w-full ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[5/4] group bg-slate-100">
                       <img 
                         src={service.image} 
                         alt={service.title} 
                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                       
                       {/* Floating Icon Badge */}
                       <div className="absolute top-8 left-8 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg">
                          <IconComponent className="text-primary-600 w-8 h-8" />
                       </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={`lg:w-1/2 w-full ${!isEven ? 'lg:order-1' : ''}`}>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">{service.title}</h2>
                    
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">
                      {service.fullDescription}
                    </p>

                    <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3"></div>
                          <span className="text-slate-700 font-medium text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Link 
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 hover:-translate-y-1"
                      >
                        Details Bekijken <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};

