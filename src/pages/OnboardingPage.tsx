import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalDetailsForm from '../components/onboarding/Tour/PersonalDetailsForm';
import PersonalContactDetailsForm from '../components/onboarding/Tour/PersonalContactDetailsForm';
import IncomeDetailsForm from '../components/onboarding/Tour/IncomeDetailsForm';
import TaxDetailsForm from '../components/onboarding/Tour/TaxDetailsForm';
import WorkDetailsForm from '../components/onboarding/Tour/WorkDetailsForm';
import ConfirmYourIncomeForm from '../components/onboarding/Tour/ConfirmYourIncomeForm';
import SelfEmployedEstimateForm from '../components/onboarding/Tour/SelfEmployedEstimateForm';
import BusinessRegistrationForm from '../components/onboarding/Tour/BusinessRegistrationForm';
import PersonalBankAccountForm from '../components/onboarding/Tour/PersonalBankAccountForm';
import ChooseAnIdDocumentForm from '../components/onboarding/Tour/ChooseAnIdDocumentForm';
import CardOptInForm from '../components/onboarding/Tour/CardOptInForm';
import OnboardingTourControls from '../components/onboarding/Tour/OnboardingTourControls';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();

  const totalSteps = 12;

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsForm onNext={handleNext} initialData={formData} />;
      case 2:
        return <PersonalContactDetailsForm onNext={handleNext} initialData={formData} />;
      case 3:
        return <IncomeDetailsForm onNext={handleNext} initialData={formData} />;
      case 4:
        return <TaxDetailsForm onNext={handleNext} initialData={formData} />;
      case 5:
        return <WorkDetailsForm onNext={handleNext} initialData={formData} />;
      case 6:
        return <ConfirmYourIncomeForm onNext={handleNext} initialData={formData} />;
      case 7:
        return <SelfEmployedEstimateForm onNext={handleNext} initialData={formData} />;
      case 8:
        return <BusinessRegistrationForm onNext={handleNext} initialData={formData} />;
      case 9:
        return <PersonalBankAccountForm onNext={handleNext} initialData={formData} />;
      case 10:
        return <ChooseAnIdDocumentForm onNext={handleNext} initialData={formData} />;
      case 11:
        return <CardOptInForm onNext={handleNext} initialData={formData} />;
      case 12:
        return (
          <div className="text-center py-5">
            <h2>Welcome!</h2>
            <p className="text-muted">Your account setup is complete.</p>
            <button className="btn btn-primary" onClick={completeOnboarding}>
              Get Started
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <h1>Welcome to Xero Alternative</h1>
          <p className="text-muted">Let's get your account set up</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Step {currentStep} of {totalSteps}</span>
            <span className="text-muted">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              aria-valuenow={(currentStep / totalSteps) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          <div className="card-body p-4">
            {renderStep()}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-4">
          <OnboardingTourControls
            onBack={handleBack}
            canGoBack={currentStep > 1}
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
