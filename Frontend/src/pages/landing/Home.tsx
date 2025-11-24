import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Key, ShieldCheck, Store, MapPin, Phone, Smartphone, ChevronRight, ChevronLeft, Wrench, Wifi, Lock } from 'lucide-react';
import { LandingButton as Button } from '@/components/landing/LandingButton';
import { FEATURED_PRODUCTS, STATS, BRANDS, CONTACT_INFO, CERTIFICATIONS, BUSINESS_VALUES, TESTIMONIALS } from '@/data/landingData';
import { Reveal } from '@/components/landing/Reveal';
import { SolutionFinder } from '@/components/landing/SolutionFinder';
import * as Icons from 'lucide-react';

const SLIDES = [
  {
    id: 'tedee',
    brand: 'tedee',
    logo: 'https://tedee.com/wp-content/themes/tedee/assets/images/logo.svg',
    title: 'Slimmer wonen begint hier.',
    subtitle: 'De kleinste, stilste en krachtigste slotmotor ter wereld. Ontworpen om gezien te worden.',
    image: 'https://www.btdbeveiliging.nl/site/assets/files/1035/tedee_pro.jpg',
    theme: {
      bg: 'bg-slate-50',
      accent: 'text-slate-900',
      text: 'text-slate-600',
      button: 'secondary',
      blob: 'bg-slate-200'
    }
  },
  {
    id: 'tapkey',
    brand: 'Tapkey',
    logo: 'https://shop.tapkey.com/cdn/shop/files/Tapkey_Logo_Blue_200x.png',
    title: 'Mobile Access Control.',
    subtitle: 'Uw smartphone is de sleutel. Eenvoudig beheer via de app voor kantoor en bedrijf.',
    image: 'https://shop.tapkey.com/cdn/shop/products/DSC7711_quadrat-ausschnitt_f0879fd6-12bf-4035-826e-009858166fd9_493x.png?v=1738919104',
    theme: {
      bg: 'bg-white', // White
      accent: 'text-red-600', // Red accent
      text: 'text-slate-700',
      button: 'secondary',
      blob: 'bg-red-100'
    }
  },
  {
    id: 'iseo',
    brand: 'ISEO',
    logo: 'https://www.iseo.com/files/layout/logo_iseo_header.png',
    title: 'Ultimate Freedom.',
    subtitle: 'Iseo Libra: Volledig draadloos, SKG*** veilig en te openen met tag, kaart of telefoon.',
    image: 'https://www.windowo.com/data/image/Iseo/AlbergoSmartphone2.jpg',
    theme: {
      bg: 'bg-[#fff1f2]', // Light red tint
      accent: 'text-[#ef4444]', // Iseo Red
      text: 'text-slate-600',
      button: 'secondary', // Dark button for contrast
      blob: 'bg-red-200'
    }
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="bg-white overflow-hidden font-sans">
      {/* Animated Hero Carousel - Reduced height to show Trust Strip */}
      <section className="relative min-h-[60vh] lg:min-h-[60vh] flex items-center overflow-hidden">
        
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${slide.theme.bg}`}
            >
              {/* Unique Atmospheric Backgrounds per Brand */}
              {isActive && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   {/* Tedee: Soft, circular, modern home feel */}
                   {slide.id === 'tedee' && (
                     <>
                       <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-slate-200 mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                       <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gray-200 mix-blend-multiply filter blur-3xl opacity-50"></div>
                     </>
                   )}

                   {/* Tapkey: Red, White, Black - Technical/Sharp */}
                   {slide.id === 'tapkey' && (
                     <>
                       <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                       <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
                       <div className="absolute bottom-20 left-20 w-32 h-32 border-4 border-black/5 rounded-full animate-ping opacity-20"></div>
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-red-500/10 transform rotate-45"></div>
                     </>
                   )}

                   {/* Iseo: Angular, sharp, secure, red accents */}
                   {slide.id === 'iseo' && (
                     <>
                        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                           <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[120%] bg-red-50 transform -skew-x-12"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
                     </>
                   )}
                </div>
              )}

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center pt-24 pb-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
                  
                  {/* Text Content */}
                  <div className={`text-center lg:text-left transition-all duration-1000 transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    
                    {/* Brand Logo / Badge */}
                    <div className="mb-6 md:mb-8 flex justify-center lg:justify-start items-center">
                       <div className="h-10 md:h-12 relative">
                          <img 
                            src={slide.logo} 
                            alt={slide.brand} 
                            className={`h-full w-auto object-contain ${slide.id === 'tapkey' ? 'grayscale brightness-0' : ''}`}
                            onError={(e) => {
                              // If image fails, render text-based fallback
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <span className={`hidden text-3xl md:text-4xl font-black tracking-tighter uppercase ${slide.theme.accent}`}>{slide.brand}</span>
                       </div>
                       <div className={`ml-4 pl-4 border-l-2 ${slide.id === 'tapkey' ? 'border-red-600' : slide.id === 'iseo' ? 'border-red-200' : 'border-slate-200'}`}>
                          <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase block ${slide.theme.accent}`}>Official Partner</span>
                       </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 leading-[1.1] text-slate-900">
                      {slide.title}
                    </h1>

                    <p className={`text-base md:text-lg lg:text-xl mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light ${slide.theme.text}`}>
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Button 
                        size="lg" 
                        variant={slide.theme.button as any}
                        onClick={() => navigate(`/products/${slide.id}`)} 
                        className={`font-bold shadow-xl hover:-translate-y-1 px-8 ${
                            slide.id === 'tapkey' ? 'bg-black text-white hover:bg-zinc-800' : 
                            slide.id === 'iseo' ? 'bg-[#ef4444] hover:bg-[#dc2626]' : ''
                        }`}
                      >
                        Ontdek {slide.brand}
                      </Button>
                      <Button 
                        size="lg" 
                        variant="ghost" 
                        className="font-bold text-slate-600 hover:bg-black/5"
                        onClick={() => navigate('/contact')}
                      >
                        Vraag Advies
                      </Button>
                    </div>
                  </div>

                  {/* High-End Product Showcase */}
                  <div className={`hidden lg:block relative perspective-1000 transition-all duration-1000 delay-300 transform ${isActive ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-95'}`}>
                      <div className="relative w-full aspect-[5/4] max-w-xl mx-auto flex items-center justify-center">
                        
                        {/* Framed Product Card */}
                        <div className={`relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-700 bg-white ring-8 ring-white/40`}>
                           
                           {/* Product Image - Full Bleed */}
                           <img 
                              src={slide.image} 
                              alt={slide.title} 
                              className="w-full h-full object-cover relative z-10"
                           />

                           {/* Internal Gradient Overlay for text contrast if needed (subtle) */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Feature Badge - Floating */}
                        <div className={`absolute -bottom-6 -left-6 z-20 bg-white p-5 rounded-2xl shadow-xl flex items-center space-x-4 animate-fade-in-up border border-slate-50`} style={{ animationDelay: '0.6s' }}>
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                               slide.id === 'tapkey' ? 'bg-black text-red-500' : 
                               slide.id === 'iseo' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                           }`}>
                              {slide.id === 'tapkey' ? <Smartphone size={24} /> : slide.id === 'iseo' ? <Wifi size={24} /> : <Lock size={24} />}
                           </div>
                           <div>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technology</div>
                              <div className="font-bold text-slate-900 text-lg">
                                {slide.id === 'tapkey' ? 'NFC + Bluetooth' : slide.id === 'iseo' ? 'Argo App Ready' : 'Auto-Unlock'}
                              </div>
                           </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50">
           <button onClick={prevSlide} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
              <ChevronLeft size={20} />
           </button>
           <div className="flex space-x-3">
             {SLIDES.map((slide, idx) => (
               <button 
                 key={idx}
                 onClick={() => { setIsAutoPlaying(false); setCurrentSlide(idx); }}
                 className={`transition-all duration-300 rounded-full ${currentSlide === idx ? `w-8 h-2 ${
                     slide.id === 'tapkey' ? 'bg-black' : 
                     slide.id === 'iseo' ? 'bg-[#ef4444]' : 'bg-slate-800'
                 }` : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`}
               />
             ))}
           </div>
           <button onClick={nextSlide} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
              <ChevronRight size={20} />
           </button>
        </div>
      </section>

      {/* Solution Finder - High Engagement Interaction */}
      <section className="relative z-30 -mt-12 mb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <SolutionFinder />
        </div>
      </section>

      {/* Trust Strip - Immediate Authority */}
      <div className="bg-white border-b border-slate-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
             {CERTIFICATIONS.map((cert, idx) => {
               const Icon = (Icons as any)[cert.icon] || Icons.Shield;
               return (
                 <div key={idx} className="flex items-center justify-center p-6 group hover:bg-slate-50 transition-colors cursor-default">
                    <Icon className="text-slate-400 group-hover:text-primary-600 transition-colors mr-3 h-6 w-6" strokeWidth={1.5} />
                    <div>
                      <div className="font-bold text-slate-700 text-sm group-hover:text-primary-900">{cert.name}</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{cert.description}</div>
                    </div>
                 </div>
               )
             })}
          </div>
        </div>
      </div>

      {/* Quick Service / Store Section */}
      <section className="py-24 bg-white border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Winkel & Service</h2>
                  <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
                     Ook voor de kleine klusjes staan we klaar. Bestel direct online of kom langs aan de balie.
                  </p>
               </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
               <Reveal delay={100}>
                  <div className="bg-slate-50 rounded-[2rem] p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer" onClick={() => navigate('/bestellen')}>
                     <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Key className="text-primary-600" size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Sleutel Service</h3>
                     <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                        Sleutel kwijt of extra nodig? Stuur een foto via WhatsApp en wij maken hem direct bij.
                     </p>
                     <span className="text-primary-600 font-bold flex items-center text-sm group-hover:translate-x-2 transition-transform">
                        Direct Bestellen <ArrowRight size={16} className="ml-2" />
                     </span>
                  </div>
               </Reveal>

               <Reveal delay={200}>
                  <div className="bg-slate-50 rounded-[2rem] p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer" onClick={() => navigate('/bestellen')}>
                     <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icons.Unlock className="text-primary-600" size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Cilinders</h3>
                     <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                        Nieuwe cilinder nodig? Gebruik onze configurator om direct de juiste maat te bestellen.
                     </p>
                     <span className="text-primary-600 font-bold flex items-center text-sm group-hover:translate-x-2 transition-transform">
                        Nu Configureren <ArrowRight size={16} className="ml-2" />
                     </span>
                  </div>
               </Reveal>

               <Reveal delay={300}>
                  <div className="bg-slate-50 rounded-[2rem] p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer" onClick={() => navigate('/contact')}>
                     <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Wrench className="text-primary-600" size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Onderhoud</h3>
                     <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                        Haperend slot? Vaak lost onze speciale slotspray het probleem al op. Verkrijgbaar in de winkel.
                     </p>
                     <span className="text-primary-600 font-bold flex items-center text-sm group-hover:translate-x-2 transition-transform">
                        Naar de Winkel <ArrowRight size={16} className="ml-2" />
                     </span>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* Stats / Credibility Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon === 'Key' ? Key : stat.icon === 'ShieldCheck' ? ShieldCheck : stat.icon === 'Star' ? Star : Store;
                return (
                  <div key={idx} className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="inline-flex p-3 rounded-2xl bg-slate-50 text-slate-400 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Icon size={24} />
                    </div>
                    <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Business / Enterprise Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate opacity-[0.1]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <Reveal>
               <h2 className="text-primary-500 font-bold tracking-widest uppercase text-sm mb-4">Zakelijke Beveiliging</h2>
               <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                 Schaalbare toegangscontrole voor Enterprise omgevingen.
               </h3>
               <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
                 Wij begrijpen dat continuïteit en compliance cruciaal zijn. BTD levert en beheert sluitsystemen voor zorginstellingen, kantoorpanden en VvE's met militaire precisie.
               </p>
               
               <div className="space-y-6">
                 {BUSINESS_VALUES.map((val, idx) => {
                   const Icon = (Icons as any)[val.icon] || Icons.Shield;
                   return (
                     <div key={idx} className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-primary-400 shrink-0 border border-white/10">
                           <Icon size={20} />
                        </div>
                        <div className="ml-5">
                           <h4 className="text-white font-bold text-lg">{val.title}</h4>
                           <p className="text-slate-400 text-sm mt-1 leading-relaxed">{val.description}</p>
                        </div>
                     </div>
                   )
                 })}
               </div>

               <Button 
                 variant="white-outline" 
                 size="lg" 
                 className="mt-12"
                 onClick={() => navigate('/services/sluitsystemen')}
               >
                 Bekijk Zakelijke Oplossingen
               </Button>
             </Reveal>

             <Reveal delay={200}>
               <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
                   alt="Modern Office" 
                   className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                    <div className="flex items-center space-x-2 text-white/80 text-sm font-mono mb-2">
                       <ShieldCheck size={14} />
                       <span>SYSTEM ACTIVE</span>
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                    <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-primary-500"></div>
                    </div>
                 </div>
               </div>
             </Reveal>
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">DOM Sluitsystemen</h2>
              <p className="text-xl text-slate-600 font-light">
                Duitse degelijkheid, lokaal geassembleerd. Van enkele deur tot compleet masterkey plan.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PRODUCTS.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 150}>
                <div className="group h-full bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  {/* Image Container */}
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-6 bg-slate-50 border border-slate-100 p-8">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="px-5 pb-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {product.title}
                      </h3>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wide">SKG***</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow line-clamp-3">
                      {product.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100">
                       <Link to={product.link} className="inline-flex items-center font-bold text-sm text-primary-600 hover:text-primary-700">
                         Specificaties <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                       </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Ticker */}
      <div className="py-16 bg-white overflow-hidden border-y border-slate-100">
        <Reveal>
          <p className="text-center text-slate-400 font-bold uppercase tracking-[0.2em] mb-12 text-xs">Trusted by professionals</p>
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-scroll whitespace-nowrap flex space-x-16 px-8 group-hover:[animation-play-state:paused]">
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <span key={i} className="text-2xl font-bold text-slate-300 hover:text-slate-800 transition-colors cursor-default select-none">
                  {brand}
                </span>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          </div>
        </Reveal>
      </div>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-16 text-center">Wat onze partners zeggen</h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8">
               {TESTIMONIALS.map((t, i) => (
                  <Reveal key={t.id} delay={i * 100}>
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
                        <div className="flex text-amber-400 mb-4">
                           {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-600 mb-6 italic leading-relaxed flex-grow">"{t.text}"</p>
                        <div className="flex items-center mt-auto">
                           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold mr-3">
                              {t.name.charAt(0)}
                           </div>
                           <div>
                              <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                              <div className="text-xs text-slate-400 font-medium">{t.company}</div>
                           </div>
                        </div>
                     </div>
                  </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* Store Info / CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
             
             <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Bezoek onze showroom</h2>
                   <p className="text-xl text-slate-300 mb-10 font-light">
                      Ervaar de kwaliteit van onze producten zelf. Onze experts staan klaar voor een demonstratie en persoonlijk advies.
                   </p>
                   <div className="space-y-4 mb-10">
                      <div className="flex items-center text-white">
                         <MapPin className="mr-4 text-primary-500" /> 
                         <span className="font-medium">{CONTACT_INFO.address}</span>
                      </div>
                      <div className="flex items-center text-white">
                         <Phone className="mr-4 text-primary-500" /> 
                         <span className="font-medium">{CONTACT_INFO.phone}</span>
                      </div>
                      <div className="flex items-center text-white">
                         <Store className="mr-4 text-primary-500" /> 
                         <span className="font-medium">{CONTACT_INFO.hours}</span>
                      </div>
                   </div>
                   <Button onClick={() => navigate('/contact')} size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-transparent font-bold">
                      Routebeschrijving
                   </Button>
                </div>
                
                {/* Map Placeholder */}
                <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-700 shadow-xl group cursor-pointer" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${CONTACT_INFO.mapLat},${CONTACT_INFO.mapLon}`)}>
                   <img 
                      src="https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2070&auto=format&fit=crop" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                      alt="Map Location" 
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white group-hover:scale-110 transition-transform">
                         <MapPin size={32} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

