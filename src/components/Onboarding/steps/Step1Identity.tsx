'use client';

import React, { Component } from 'react';
import styles from './Step1Identity.module.scss';
import { mockUser } from '@/data/mockData';

interface Step1IdentityProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    identityVerified: boolean;
  };
  onDataChange: (data: Partial<Step1IdentityProps['formData']>) => void;
  onLogin: () => void;
  onSignup: () => void;
}

interface Step1IdentityState {
  showNotification: boolean;
  notificationMessage: string;
  errors: {
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    identityVerified?: boolean;
  };
}

class Step1Identity extends Component<Step1IdentityProps, Step1IdentityState> {
  private notificationTimeout: NodeJS.Timeout | null = null;

  constructor(props: Step1IdentityProps) {
    super(props);
    this.state = {
      showNotification: false,
      notificationMessage: '',
      errors: {},
    };
  }

  componentDidMount() {
    window.addEventListener('validateStep1', this.handleValidationEvent);
  }

  componentWillUnmount() {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    window.removeEventListener('validateStep1', this.handleValidationEvent);
  }

  handleValidationEvent = () => {
    this.validateAndShowErrors();
  };

  validateAndShowErrors = () => {
    const { formData } = this.props;
    const errors: Step1IdentityState['errors'] = {};
    const missing: string[] = [];

    if (!formData.identityVerified) {
      errors.identityVerified = true;
      missing.push('Identity Verification');
    }

    if (!formData.name || formData.name.trim() === '') {
      errors.name = true;
      missing.push('Name');
    }

    if (!formData.email || formData.email.trim() === '') {
      errors.email = true;
      missing.push('Email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = true;
      if (!missing.includes('Email')) {
        missing.push('Valid Email');
      }
    }

    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = true;
      missing.push('Phone Number');
    }

    this.setState({ errors });

    if (missing.length > 0) {
      this.showNotification(
        `Please complete all required fields: ${missing.join(', ')}`
      );
    }
  };

  showNotification = (message: string) => {
    this.setState({ showNotification: true, notificationMessage: message });

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.setState({ showNotification: false });
    }, 5000);
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.props.onDataChange({ [name]: value });

    this.setState((prevState) => ({
      errors: {
        ...prevState.errors,
        [name]: false,
      },
    }));
  };

  handleLogin = () => {
    this.props.onLogin();
    this.setState({ errors: {} });
  };

  handleSignup = () => {
    this.props.onSignup();
    this.setState({ errors: {} });
  };

  render() {
    const { formData } = this.props;
    const { showNotification, notificationMessage, errors } = this.state;

    return (
      <div className={styles.step1}>
        {showNotification && (
          <div className={styles.step1__notification}>
            <span className={styles.step1__notification_icon}>⚠️</span>
            <span className={styles.step1__notification_text}>
              {notificationMessage}
            </span>
          </div>
        )}

        <div className={styles.step1__icon}>🛡️</div>
        <h2 className={styles.step1__title}>Authorise</h2>
        <p className={styles.step1__description}>
          Verify your identity to proceed with registration
        </p>

        <div
          className={`${styles.step1__auth_buttons} ${
            errors.identityVerified
              ? styles['step1__auth_buttons--warning']
              : ''
          }`}
        >
          <button
            className={styles.step1__auth_button_primary}
            onClick={this.handleLogin}
          >
            Authorize with SmartID
          </button>
          <button
            className={styles.step1__auth_button_secondary}
            onClick={this.handleSignup}
          >
            Authorize with Swedbank
          </button>
        </div>

        {errors.identityVerified && !formData.identityVerified && (
          <div className={styles.step1__error_message}>
            Please verify your identity using one of the authorization methods
            above
          </div>
        )}

        {formData.identityVerified && (
          <div className={styles.step1__verified}>
            <span className={styles.step1__verified_icon}>✓</span>
            <span className={styles.step1__verified_text}>
              Identity Verified
            </span>
          </div>
        )}

        <div className={styles.step1__form}>
          <div className={styles.step1__form_group}>
            <label htmlFor="name" className={styles.step1__form_label}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={this.handleInputChange}
              className={`${styles.step1__form_input} ${
                errors.name ? styles['step1__form_input--error'] : ''
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <span className={styles.step1__form_error}>
                Name is required
              </span>
            )}
          </div>

          <div className={styles.step1__form_group}>
            <label htmlFor="phone" className={styles.step1__form_label}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={this.handleInputChange}
              className={`${styles.step1__form_input} ${
                errors.phone ? styles['step1__form_input--error'] : ''
              }`}
              placeholder="+371 2123 4567"
            />
            {errors.phone && (
              <span className={styles.step1__form_error}>
                Phone number is required
              </span>
            )}
          </div>

          <div className={styles.step1__form_group}>
            <label htmlFor="email" className={styles.step1__form_label}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={this.handleInputChange}
              className={`${styles.step1__form_input} ${
                errors.email ? styles['step1__form_input--error'] : ''
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <span className={styles.step1__form_error}>
                Valid email is required
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Step1Identity;
