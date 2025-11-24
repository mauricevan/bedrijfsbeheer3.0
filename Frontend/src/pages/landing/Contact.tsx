import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { LandingButton as Button } from '@/components/landing/LandingButton';
import { CONTACT_INFO } from '@/data/landingData';
import { Reveal } from '@/components/landing/Reveal';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Bedankt voor uw bericht! Dit is een demo.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <Reveal>
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Contact</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Kom langs in onze winkel in Dordrecht of neem contact op voor advies.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Info Side */}
          <div className="space-y-10">
            <Reveal delay={100}>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply blur-3xl opacity-40 -mr-16 -mt-16"></div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-10 relative z-10">Gegevens</h2>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div className="ml-6">
                      <p className="font-bold text-slate-900 text-lg">Winkeladres</p>
                      <p className="text-slate-600 mt-1">{CONTACT_INFO.address}</p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${CONTACT_INFO.mapLat},${CONTACT_INFO.mapLon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 font-bold text-sm mt-2 inline-block hover:underline"
                      >
                        Bekijk op kaart
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                      <Phone size={24} />
                    </div>
                    <div className="ml-6">
                      <p className="font-bold text-slate-900 text-lg">Telefoon</p>
                      <a href={`tel:${CONTACT_INFO.phone}`} className="text-slate-600 hover:text-primary-600 transition-colors mt-1 block font-medium">
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                      <Mail size={24} />
                    </div>
                    <div className="ml-6">
                      <p className="font-bold text-slate-900 text-lg">E-mail</p>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-slate-600 hover:text-primary-600 transition-colors mt-1 block">
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                      <Clock size={24} />
                    </div>
                    <div className="ml-6">
                      <p className="font-bold text-slate-900 text-lg">Openingstijden</p>
                      <p className="text-slate-600 mt-1">{CONTACT_INFO.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form Side */}
          <Reveal delay={200}>
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Stuur bericht</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Naam</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                    placeholder="Uw naam"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                      placeholder="naam@email.nl"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Telefoon</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                      placeholder="06 ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bericht</label>
                  <textarea 
                    name="message" 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none resize-none"
                    placeholder="Waarmee kunnen we u helpen?"
                  ></textarea>
                </div>

                <Button type="submit" size="lg" className="w-full justify-center text-lg py-4 shadow-xl shadow-primary-500/20">
                  Versturen <Send size={20} className="ml-2" />
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

