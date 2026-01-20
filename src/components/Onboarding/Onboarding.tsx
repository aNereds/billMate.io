'use client';

import React, { Component } from 'react';
import styles from './Onboarding.module.scss';
import Step1Identity from './steps/Step1Identity';
import Step2Company from './steps/Step2Company';
import Step3Debtors from './steps/Step3Debtors';
import Step4Contract from './steps/Step4Contract';
import { mockUser } from '@/data/mockData';
import { authService } from '@/utils/auth';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

interface OnboardingState {
  currentStep: number;
  formData: {
    name: string;
    email: string;
    phone: string;
    identityVerified: boolean;
    selectedCompany: string | null;
    debtors: Array<{
      companyName: string;
      country: string;
      registrationNumber: string;
      creditLimit: string;
    }>;
    contractAgreed: boolean;
    termsAgreed: boolean;
    policyAgreed: boolean;
  };
}

class Onboarding extends Component<{}, OnboardingState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentStep: 1,
      formData: {
        name: '',
        email: '',
        phone: '',
        identityVerified: false,
        selectedCompany: null,
        debtors: [],
        contractAgreed: false,
        termsAgreed: false,
        policyAgreed: false,
      },
    };
  }

  handleNext = () => {
    if (this.state.currentStep < 4) {
      // Validate current step before proceeding
      if (this.state.currentStep === 1) {
        const { name, email, phone, identityVerified } = this.state.formData;
        
        if (!identityVerified || !name || !email || !phone) {
          // Trigger validation in Step1Identity
          const event = new CustomEvent('validateStep1');
          window.dispatchEvent(event);
          return;
        }
      }
      
      if (this.state.currentStep === 2) {
        const { selectedCompany } = this.state.formData;
        
        if (!selectedCompany) {
          // Trigger validation in Step2Company
          const event = new CustomEvent('validateStep2');
          window.dispatchEvent(event);
          return;
        }
      }
      
      this.setState({ currentStep: this.state.currentStep + 1 });
    }
  };

  handleBack = () => {
    if (this.state.currentStep > 1) {
      this.setState({ currentStep: this.state.currentStep - 1 });
    }
  };

  handleFormDataChange = (data: Partial<OnboardingState['formData']>) => {
    this.setState((prevState) => ({
      formData: { ...prevState.formData, ...data },
    }));
  };

  handleLogin = () => {
    // Mock login - fill form with mock data and save to localStorage
    const userData = {
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      identityVerified: true,
      onboardingCompleted: false,
    };
    
    this.setState({
      formData: {
        ...this.state.formData,
        ...userData,
      },
    });
    
    // Save to localStorage
    authService.login(userData);
  };

  handleSignup = () => {
    // Mock signup - same as login for demo
    this.handleLogin();
  };

  handleComplete = () => {
    const { contractAgreed, termsAgreed, policyAgreed } = this.state.formData;

    // Validate all checkboxes
    if (!contractAgreed || !termsAgreed || !policyAgreed) {
      const missing: string[] = [];
      if (!contractAgreed) missing.push('Factoring Contract');
      if (!termsAgreed) missing.push('Contract Terms');
      if (!policyAgreed) missing.push('Additional Policy');

      // Trigger notification in Step4Contract
      const event = new CustomEvent('showValidationNotification', {
        detail: {
          message: `Please confirm all agreements: ${missing.join(', ')}`,
        },
      });
      window.dispatchEvent(event);
      return;
    }

    // Save completed onboarding to localStorage
    const userData = {
      name: this.state.formData.name || mockUser.name,
      email: this.state.formData.email || mockUser.email,
      phone: this.state.formData.phone || mockUser.phone,
      identityVerified: true,
      onboardingCompleted: true,
    };
    
    authService.completeOnboarding(userData);
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  render() {
    const { currentStep, formData } = this.state;
    const steps = [
      { number: 1, title: 'Identity Verification' },
      { number: 2, title: 'Company Details' },
      { number: 3, title: 'Debtor List' },
      { number: 4, title: 'Contract Review' },
    ];

    return (
      <div className={styles.onboarding}>
        <div className={styles.onboarding__container}>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Onboarding' },
            ]}
          />
          <div className={styles.onboarding__header}>
            <h1 className={styles.onboarding__title}>Welcome to BillMate.io</h1>
            <p className={styles.onboarding__subtitle}>
              Let's get your account set up
            </p>
          </div>

          <div className={styles.onboarding__progress}>
            <div className={styles.onboarding__progress_bar}>
              {steps.map((step) => (
                <React.Fragment key={step.number}>
                  <div
                    className={`${styles.onboarding__progress_step} ${
                      currentStep >= step.number
                        ? styles['onboarding__progress_step--active']
                        : ''
                    }`}
                  >
                    {step.number}
                  </div>
                  {step.number < steps.length && (
                    <div
                      className={`${styles.onboarding__progress_line} ${
                        currentStep > step.number
                          ? styles['onboarding__progress_line--active']
                          : ''
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className={styles.onboarding__progress_info}>
              <span className={styles.onboarding__progress_text}>
                Step {currentStep} of {steps.length}
              </span>
              <span className={styles.onboarding__progress_title}>
                {steps[currentStep - 1].title}
              </span>
            </div>
          </div>

          <div className={styles.onboarding__content}>
            {currentStep === 1 && (
              <Step1Identity
                formData={formData}
                onDataChange={this.handleFormDataChange}
                onLogin={this.handleLogin}
                onSignup={this.handleSignup}
              />
            )}
            {currentStep === 2 && (
              <Step2Company
                formData={formData}
                onDataChange={this.handleFormDataChange}
              />
            )}
            {currentStep === 3 && (
              <Step3Debtors
                formData={formData}
                onDataChange={this.handleFormDataChange}
              />
            )}
            {currentStep === 4 && (
              <div data-step="4">
                <Step4Contract
                  formData={{
                    contractAgreed: formData.contractAgreed,
                    termsAgreed: formData.termsAgreed,
                    policyAgreed: formData.policyAgreed,
                  }}
                  onDataChange={(data) => this.handleFormDataChange(data)}
                  onComplete={this.handleComplete}
                />
              </div>
            )}
          </div>

          <div className={styles.onboarding__navigation}>
            {currentStep > 1 && (
              <button
                className={styles.onboarding__button_back}
                onClick={this.handleBack}
              >
                Back
              </button>
            )}
            {currentStep < 4 ? (
              <button
                className={styles.onboarding__button_continue}
                onClick={this.handleNext}
              >
                Continue
              </button>
            ) : (
              <button
                className={styles.onboarding__button_complete}
                onClick={this.handleComplete}
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Onboarding;
