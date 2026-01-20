'use client';

import React, { Component } from 'react';
import styles from './AddInvoiceModal.module.scss';
import { Invoice } from '@/data/mockData';

interface AddInvoiceModalProps {
  onClose: () => void;
  onSave: (invoice: Partial<Invoice>) => void;
}

interface AddInvoiceModalState {
  formData: {
    company: string;
    amount: string;
    dueDate: string;
    status: Invoice['status'];
  };
  errors: {
    company?: string;
    amount?: string;
    dueDate?: string;
  };
}

class AddInvoiceModal extends Component<AddInvoiceModalProps, AddInvoiceModalState> {
  constructor(props: AddInvoiceModalProps) {
    super(props);
    this.state = {
      formData: {
        company: '',
        amount: '',
        dueDate: '',
        status: 'pending',
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
    const errors: AddInvoiceModalState['errors'] = {};

    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    }

    if (!formData.amount.trim()) {
      errors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }

    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.validate()) {
      this.props.onSave({
        company: this.state.formData.company,
        amount: Number(this.state.formData.amount),
        dueDate: this.state.formData.dueDate,
        status: this.state.formData.status,
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
            <h2 className={styles.modal__title}>Add Invoice</h2>
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
                name="company"
                value={formData.company}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.company ? styles['modal__input--error'] : ''
                }`}
                placeholder="Enter company name"
              />
              {errors.company && (
                <span className={styles.modal__error}>{errors.company}</span>
              )}
            </div>

            <div className={styles.modal__field}>
              <label className={styles.modal__label}>
                Amount (€) <span className={styles.modal__required}>*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.amount ? styles['modal__input--error'] : ''
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.amount && (
                <span className={styles.modal__error}>{errors.amount}</span>
              )}
            </div>

            <div className={styles.modal__field}>
              <label className={styles.modal__label}>
                Due Date <span className={styles.modal__required}>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.dueDate ? styles['modal__input--error'] : ''
                }`}
              />
              {errors.dueDate && (
                <span className={styles.modal__error}>{errors.dueDate}</span>
              )}
            </div>

            <div className={styles.modal__field}>
              <label className={styles.modal__label}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={this.handleInputChange}
                className={styles.modal__select}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>
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
                Add Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddInvoiceModal;
