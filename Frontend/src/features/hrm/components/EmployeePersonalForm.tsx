import React from 'react';
import { Input } from '@/components/common/Input';
import type { PersonalDetails } from '../types/hrm.types';

interface EmployeePersonalFormProps {
  personalDetails: PersonalDetails;
  onChange: (details: PersonalDetails) => void;
}

export const EmployeePersonalForm: React.FC<EmployeePersonalFormProps> = ({
  personalDetails,
  onChange,
}) => {
  const handleChange = (field: keyof PersonalDetails, value: any) => {
    onChange({ ...personalDetails, [field]: value });
  };

  const handleEmergencyChange = (field: keyof PersonalDetails['emergencyContact'], value: string) => {
    onChange({
      ...personalDetails,
      emergencyContact: {
        ...personalDetails.emergencyContact,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Persoonlijke Gegevens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Adres
            </label>
            <Input
              value={personalDetails.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Postcode
            </label>
            <Input
              value={personalDetails.postalCode || ''}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Woonplaats
            </label>
            <Input
              value={personalDetails.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              BSN
            </label>
            <Input
              value={personalDetails.bsn || ''}
              onChange={(e) => handleChange('bsn', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Geboortedatum
            </label>
            <Input
              type="date"
              value={personalDetails.dateOfBirth || ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nationaliteit
            </label>
            <Input
              value={personalDetails.nationality || ''}
              onChange={(e) => handleChange('nationality', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Geslacht
            </label>
            <select
              value={personalDetails.gender || 'male'}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="male">Man</option>
              <option value="female">Vrouw</option>
              <option value="other">Anders</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Burgerlijke Staat
            </label>
            <select
              value={personalDetails.maritalStatus || 'single'}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="single">Ongehuwd</option>
              <option value="married">Gehuwd</option>
              <option value="partnership">Geregistreerd Partnerschap</option>
              <option value="divorced">Gescheiden</option>
              <option value="widowed">Weduwe/Weduwnaar</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Noodcontact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Naam
            </label>
            <Input
              value={personalDetails.emergencyContact?.name || ''}
              onChange={(e) => handleEmergencyChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Telefoon
            </label>
            <Input
              value={personalDetails.emergencyContact?.phone || ''}
              onChange={(e) => handleEmergencyChange('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Relatie
            </label>
            <Input
              value={personalDetails.emergencyContact?.relation || ''}
              onChange={(e) => handleEmergencyChange('relation', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
