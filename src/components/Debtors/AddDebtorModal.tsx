'use client';

import React, { Component } from 'react';
import styles from './AddDebtorModal.module.scss';
import { Debtor } from '@/data/mockData';

interface AddDebtorModalProps {
  onClose: () => void;
  onSave: (debtor: Partial<Debtor>) => void;
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

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
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
    } else if (isNaN(Number(formData.creditLimit)) || Number(formData.creditLimit) <= 0) {
      errors.creditLimit = 'Credit limit must be a positive number';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.validate()) {
      this.props.onSave({
        companyName: this.state.formData.companyName,
        country: this.state.formData.country,
        registrationNumber: this.state.formData.registrationNumber,
        creditLimit: Number(this.state.formData.creditLimit),
      });
    }
  };

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { formData, errors } = this.state;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Add Debtor</h2>
            <button
              className={styles.modal__close}
              onClick={this.props.onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={this.handleSubmit} className={styles.modal__form}>
            <div className={styles.modal__field}>
              <label className={styles.modal__label}>
                Company Name <span className={styles.modal__required}>*</span>
              </label>
              <input
                type="text"
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

            <div className={styles.modal__field}>
              <label className={styles.modal__label}>
                Country <span className={styles.modal__required}>*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={this.handleInputChange}
                className={`${styles.modal__select} ${
                  errors.country ? styles['modal__select--error'] : ''
                }`}
              >
                <option value="Latvia">Latvia</option>
                <option value="Estonia">Estonia</option>
                <option value="Lithuania">Lithuania</option>
              </select>
              {errors.country && (
                <span className={styles.modal__error}>{errors.country}</span>
              )}
            </div>

            <div className={styles.modal__field}>
              <label className={styles.modal__label}>
                Registration Number <span className={styles.modal__required}>*</span>
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.registrationNumber ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter registration number"
              />
              {errors.registrationNumber && (
                <span className={styles.modal__error}>{errors.registrationNumber}</span>
              )}
            </div>

            <div className={styles.modal__field}>
              <label className={styles.modal__label}>
                Credit Limit (€) <span className={styles.modal__required}>*</span>
              </label>
              <input
                type="number"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.creditLimit ? styles['modal__input--error'] : ''
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.creditLimit && (
                <span className={styles.modal__error}>{errors.creditLimit}</span>
              )}
            </div>

            <div className={styles.modal__footer}>
              <button
                type="button"
                className={styles.modal__button_cancel}
                onClick={this.props.onClose}
              >
                Cancel
              </button>
              <button type="submit" className={styles.modal__button_save}>
                Add Debtor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddDebtorModal;
