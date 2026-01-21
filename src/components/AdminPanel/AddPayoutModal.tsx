'use client';

import React, { Component } from 'react';
import styles from './AddPayoutModal.module.scss';

interface AddPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payout: {
    client: string;
    invoiceId: string;
    amount: number;
    date: string;
  }) => void;
}

interface AddPayoutModalState {
  formData: {
    client: string;
    invoiceId: string;
    amount: string;
    date: string;
  };
  errors: {
    client?: string;
    invoiceId?: string;
    amount?: string;
    date?: string;
  };
}

class AddPayoutModal extends Component<AddPayoutModalProps, AddPayoutModalState> {
  constructor(props: AddPayoutModalProps) {
    super(props);
    const today = new Date().toISOString().split('T')[0];
    this.state = {
      formData: {
        client: '',
        invoiceId: '',
        amount: '',
        date: today,
      },
      errors: {},
    };
  }

  componentDidUpdate(prevProps: AddPayoutModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      const today = new Date().toISOString().split('T')[0];
      this.setState({
        formData: {
          client: '',
          invoiceId: '',
          amount: '',
          date: today,
        },
        errors: {},
      });
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

  validate = (): boolean => {
    const { formData } = this.state;
    const errors: AddPayoutModalState['errors'] = {};

    if (!formData.client.trim()) {
      errors.client = 'Client name is required';
    }

    if (!formData.invoiceId.trim()) {
      errors.invoiceId = 'Invoice ID is required';
    } else {
      const invoiceIdRegex = /^INV-\d+$/i;
      if (!invoiceIdRegex.test(formData.invoiceId.trim())) {
        errors.invoiceId = 'Invoice ID must be in format INV-XXX';
      }
    }

    if (!formData.amount.trim()) {
      errors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Amount must be a positive number';
      }
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.date = 'Date cannot be in the future';
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
      client: this.state.formData.client.trim(),
      invoiceId: this.state.formData.invoiceId.trim().toUpperCase(),
      amount: parseFloat(this.state.formData.amount),
      date: this.state.formData.date,
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

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Create New Payout</h2>
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
              <label htmlFor="client" className={styles.modal__label}>
                Client Name *
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.client ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter client name"
              />
              {errors.client && (
                <span className={styles.modal__error}>{errors.client}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="invoiceId" className={styles.modal__label}>
                Invoice ID *
              </label>
              <input
                type="text"
                id="invoiceId"
                name="invoiceId"
                value={formData.invoiceId}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.invoiceId ? styles['modal__input--error'] : ''
                }`}
                placeholder="INV-001"
              />
              {errors.invoiceId && (
                <span className={styles.modal__error}>{errors.invoiceId}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="amount" className={styles.modal__label}>
                Amount (EUR) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.amount ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
              {errors.amount && (
                <span className={styles.modal__error}>{errors.amount}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="date" className={styles.modal__label}>
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.date ? styles['modal__input--error'] : ''
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <span className={styles.modal__error}>{errors.date}</span>
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
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPayoutModal;
