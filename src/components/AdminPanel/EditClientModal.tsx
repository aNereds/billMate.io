'use client';

import React, { Component } from 'react';
import styles from './EditClientModal.module.scss';
import { Client } from '@/data/mockData';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => void;
  client: Client | null;
}

interface EditClientModalState {
  formData: {
    name: string;
    email: string;
    country: string;
    creditLimit: string;
    status: 'pending' | 'active' | 'suspended';
  };
  errors: {
    name?: string;
    email?: string;
    country?: string;
    creditLimit?: string;
  };
}

class EditClientModal extends Component<EditClientModalProps, EditClientModalState> {
  constructor(props: EditClientModalProps) {
    super(props);
    this.state = {
      formData: {
        name: '',
        email: '',
        country: 'Latvia',
        creditLimit: '',
        status: 'pending',
      },
      errors: {},
    };
  }

  componentDidUpdate(prevProps: EditClientModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      if (this.props.client) {
        this.setState({
          formData: {
            name: this.props.client.name,
            email: this.props.client.email,
            country: this.props.client.country,
            creditLimit: this.props.client.creditLimit.toString(),
            status: this.props.client.status,
          },
          errors: {},
        });
      }
      document.addEventListener('keydown', this.handleEscapeKey);
    } else if (!this.props.isOpen && prevProps.isOpen) {
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

  validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  validate = (): boolean => {
    const { formData } = this.state;
    const errors: EditClientModalState['errors'] = {};

    if (!formData.name.trim()) {
      errors.name = 'Client name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.country) {
      errors.country = 'Country is required';
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
      name: this.state.formData.name.trim(),
      email: this.state.formData.email.trim(),
      country: this.state.formData.country,
      creditLimit: parseFloat(this.state.formData.creditLimit),
      status: this.state.formData.status,
    });

    this.props.onClose();
  };

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen, client } = this.props;
    const { formData, errors } = this.state;

    if (!isOpen || !client) return null;

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
            <h2 className={styles.modal__title}>Edit Client</h2>
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
              <label htmlFor="name" className={styles.modal__label}>
                Client Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.name ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter client name"
              />
              {errors.name && (
                <span className={styles.modal__error}>{errors.name}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="email" className={styles.modal__label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.email ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <span className={styles.modal__error}>{errors.email}</span>
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

            <div className={styles.modal__form_group}>
              <label htmlFor="status" className={styles.modal__label}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={this.handleInputChange}
                className={styles.modal__select}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
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
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default EditClientModal;
