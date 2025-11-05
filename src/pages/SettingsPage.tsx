import React, { useState } from 'react';
import LoginSettings from '../components/settings/security/LoginSettings';
import Biometrics from '../components/settings/security/Biometrics';
import TwoFactorToggle from '../components/settings/security/two_factor_toggle';
import VehicleRegister from '../components/settings/vehicles/VehicleRegister';
import BrandingForm from '../components/settings/branding/BrandingForm';
import DefaultDueDateForm from '../components/settings/branding/DefaultDueDateForm';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('security');

  const tabs = [
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  return (
    <div className="settings-page">
      <h1 className="mb-4">Settings</h1>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {tabs.map((tab) => (
              <li key={tab.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="me-2">{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body">
          {activeTab === 'security' && (
            <div>
              <h3 className="mb-4">Security Settings</h3>

              <div className="mb-4">
                <h5>Login Settings</h5>
                <LoginSettings />
              </div>

              <div className="mb-4">
                <h5>Two-Factor Authentication</h5>
                <TwoFactorToggle />
              </div>

              <div className="mb-4">
                <h5>Biometric Authentication</h5>
                <Biometrics />
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div>
              <h3 className="mb-4">Vehicle Management</h3>
              <VehicleRegister />
            </div>
          )}

          {activeTab === 'branding' && (
            <div>
              <h3 className="mb-4">Branding Settings</h3>
              <BrandingForm />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h3 className="mb-4">Preferences</h3>

              <div className="mb-4">
                <h5>Default Due Date</h5>
                <DefaultDueDateForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
