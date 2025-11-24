import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT_INFO, SERVICES } from '@/data/landingData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center text-white">
              <ShieldCheck className="h-8 w-8 text-primary-400" />
              <span className="ml-3 text-xl font-bold">BTD Beveiliging</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Professionele beveiligingsoplossingen voor een veilig gevoel. VEB Erkend en 24/7 service.
            </p>
          </div>

          {/* Diensten */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Diensten</h3>
            <ul className="space-y-3">
              {SERVICES.map(service => (
                <li key={service.id}>
                  <Link to={`/services/${service.slug}`} className="text-sm hover:text-primary-400 transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary-500 shrink-0" />
                <span className="text-sm">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary-500 shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-sm hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary-500 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Bedrijf</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-primary-400 transition-colors">Over Ons</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-primary-400 transition-colors">Offerte Aanvragen</Link></li>
              <li><span className="text-sm text-slate-500 cursor-not-allowed">Privacybeleid</span></li>
              <li><span className="text-sm text-slate-500 cursor-not-allowed">Algemene Voorwaarden</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} BTD Beveiliging. Alle rechten voorbehouden.</p>
          <p className="mt-2 md:mt-0">Ontworpen in de stijl van Tapkey</p>
        </div>
      </div>
    </footer>
  );
};

