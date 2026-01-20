'use client';

import React, { Component } from 'react';
import styles from './Step2Company.module.scss';
import { mockCompanies } from '@/data/mockData';

interface Step2CompanyProps {
  formData: {
    selectedCompany: string | null;
  };
  onDataChange: (data: { selectedCompany: string | null }) => void;
}

interface Step2CompanyState {
  showNotification: boolean;
  notificationMessage: string;
  hasError: boolean;
}

class Step2Company extends Component<Step2CompanyProps, Step2CompanyState> {
  private notificationTimeout: NodeJS.Timeout | null = null;

  constructor(props: Step2CompanyProps) {
    super(props);
    this.state = {
      showNotification: false,
      notificationMessage: '',
      hasError: false,
    };
  }

  componentDidMount() {
    window.addEventListener('validateStep2', this.handleValidationEvent);
  }

  componentWillUnmount() {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    window.removeEventListener('validateStep2', this.handleValidationEvent);
  }

  handleValidationEvent = () => {
    this.validateAndShowErrors();
  };

  validateAndShowErrors = () => {
    const { selectedCompany } = this.props.formData;

    if (!selectedCompany) {
      this.setState({ hasError: true });
      this.showNotification('Please select a company or add a new one');
    } else {
      this.setState({ hasError: false });
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

  handleCompanySelect = (companyId: string) => {
    this.props.onDataChange({ selectedCompany: companyId });
    this.setState({ hasError: false });
  };

  handleAddNew = () => {
    this.props.onDataChange({ selectedCompany: 'new' });
    this.setState({ hasError: false });
  };

  render() {
    const { formData } = this.props;
    const { showNotification, notificationMessage, hasError } = this.state;

    return (
      <div className={styles.step2}>
        {showNotification && (
          <div className={styles.step2__notification}>
            <span className={styles.step2__notification_icon}>⚠️</span>
            <span className={styles.step2__notification_text}>
              {notificationMessage}
            </span>
          </div>
        )}

        <h2 className={styles.step2__title}>Company Details</h2>
        <p className={styles.step2__description}>
          Select your company or add a new one
        </p>

        {hasError && !formData.selectedCompany && (
          <div className={styles.step2__error_message}>
            Please select a company or add a new one to continue
          </div>
        )}

        <div className={styles.step2__grid}>
          {mockCompanies.map((company) => (
            <div
              key={company.id}
              className={`${styles.step2__card} ${
                formData.selectedCompany === company.id
                  ? styles['step2__card--selected']
                  : ''
              } ${
                hasError && !formData.selectedCompany
                  ? styles['step2__card--warning']
                  : ''
              }`}
              onClick={() => this.handleCompanySelect(company.id)}
            >
              <div className={styles.step2__card_icon}>🏢</div>
              <h3 className={styles.step2__card_title}>{company.name}</h3>
              <p className={styles.step2__card_reg}>
                Reg. Nr: {company.regNumber}
              </p>
              <p className={styles.step2__card_country}>{company.country}</p>
            </div>
          ))}

          <div
            className={`${styles.step2__card} ${styles['step2__card--add']} ${
              formData.selectedCompany === 'new'
                ? styles['step2__card--selected']
                : ''
            } ${
              hasError && !formData.selectedCompany
                ? styles['step2__card--warning']
                : ''
            }`}
            onClick={this.handleAddNew}
          >
            <div className={styles.step2__card_icon_add}>+</div>
            <h3 className={styles.step2__card_title}>Another company</h3>
            <p className={styles.step2__card_description}>
              Add a new company manually
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Step2Company;
