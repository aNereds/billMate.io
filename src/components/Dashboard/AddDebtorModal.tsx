'use client';

import React, { Component } from 'react';
import styles from './AddDebtorModal.module.scss';

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (debtor: {
    companyName: string;
    country: string;
    registrationNumber: string;
    creditLimit: number;
  }) => void;
}

interface AddDebtorModalState {
  formData: {
    companyName: string;
    country: string;
    registrationNumber: string;
    creditLimit: string;
  };
  errors: {
    companyName?: string;
    country?: string;
    registrationNumber?: string;
    creditLimit?: string;
  };
}

class AddDebtorModal extends Component<AddDebtorModalProps, AddDebtorModalState> {
  constructor(props: AddDebtorModalProps) {
    super(props);
    this.state = {
      formData: {
        companyName: '',
        country: 'Latvia',
        registrationNumber: '',
        creditLimit: '',
      },
      errors: {},
    };
  }

  componentDidUpdate(prevProps: AddDebtorModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      // Reset form when modal opens
      this.setState({
        formData: {
          companyName: '',
          country: 'Latvia',
          registrationNumber: '',
          creditLimit: '',
        },
        errors: {},
      });
      // Add escape key listener
      document.addEventListener('keydown', this.handleEscapeKey);
    } else if (!this.props.isOpen && prevProps.isOpen) {
      // Remove escape key listener when modal closes
      document.removeEventListener('keydown', this.handleEscapeKey);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.props.isOpen) {
      this.props.onClose();
    }
  };

  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: undefined,
      },
    }));
  };

  validate = (): boolean => {
    const { formData } = this.state;
    const errors: AddDebtorModalState['errors'] = {};

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.country) {
      errors.country = 'Country is required';
    }

    if (!formData.registrationNumber.trim()) {
      errors.registrationNumber = 'Registration number is required';
    }

    if (!formData.creditLimit.trim()) {
      errors.creditLimit = 'Credit limit is required';
    } else {
      const creditLimit = parseFloat(formData.creditLimit);
      if (isNaN(creditLimit) || creditLimit <= 0) {
        errors.creditLimit = 'Credit limit must be a positive number';
      }
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSave = () => {
    if (!this.validate()) {
      return;
    }

    this.props.onSave({
      companyName: this.state.formData.companyName.trim(),
      country: this.state.formData.country,
      registrationNumber: this.state.formData.registrationNumber.trim(),
      creditLimit: parseFloat(this.state.formData.creditLimit),
    });

    this.props.onClose();
  };

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen } = this.props;
    const { formData, errors } = this.state;

    if (!isOpen) return null;

    const countries = [
      'Latvia',
      'Estonia',
      'Lithuania',
      'Finland',
      'Sweden',
      'Denmark',
      'Norway',
    ];

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Add New Debtor</h2>
            <button
              className={styles.modal__close}
              onClick={this.props.onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.modal__body}>
            <div className={styles.modal__form_group}>
              <label htmlFor="companyName" className={styles.modal__label}>
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.companyName ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <span className={styles.modal__error}>{errors.companyName}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="country" className={styles.modal__label}>
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={this.handleInputChange}
                className={`${styles.modal__select} ${
                  errors.country ? styles['modal__select--error'] : ''
                }`}
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className={styles.modal__error}>{errors.country}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="registrationNumber" className={styles.modal__label}>
                Registration Number *
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.registrationNumber
                    ? styles['modal__input--error']
                    : ''
                }`}
                placeholder="Enter registration number"
              />
              {errors.registrationNumber && (
                <span className={styles.modal__error}>
                  {errors.registrationNumber}
                </span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="creditLimit" className={styles.modal__label}>
                Credit Limit (EUR) *
              </label>
              <input
                type="number"
                id="creditLimit"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.creditLimit ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter credit limit"
                min="0"
                step="0.01"
              />
              {errors.creditLimit && (
                <span className={styles.modal__error}>{errors.creditLimit}</span>
              )}
            </div>
          </div>

          <div className={styles.modal__footer}>
            <button
              className={styles.modal__button_cancel}
              onClick={this.props.onClose}
            >
              Cancel
            </button>
            <button
              className={styles.modal__button_save}
              onClick={this.handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDebtorModal;
