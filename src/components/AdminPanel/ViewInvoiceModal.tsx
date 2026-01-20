'use client';

import React, { Component } from 'react';
import styles from './ViewInvoiceModal.module.scss';
import { Invoice } from '@/data/mockData';

interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

class ViewInvoiceModal extends Component<ViewInvoiceModalProps> {
  componentDidUpdate(prevProps: ViewInvoiceModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
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

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen, invoice, onClose } = this.props;

    if (!isOpen || !invoice) return null;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Invoice Details</h2>
            <button
              className={styles.modal__close}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.modal__body}>
            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Invoice ID</label>
              <p className={styles.modal__value}>{invoice.invoiceId}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Company</label>
              <p className={styles.modal__value}>{invoice.company}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Amount</label>
              <p className={styles.modal__value}>
                €{invoice.amount.toLocaleString()}
              </p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Due Date</label>
              <p className={styles.modal__value}>{invoice.dueDate}</p>
            </div>

            {invoice.date && (
              <div className={styles.modal__info_group}>
                <label className={styles.modal__label}>Date</label>
                <p className={styles.modal__value}>{invoice.date}</p>
              </div>
            )}

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Status</label>
              <span
                className={`${styles.modal__status} ${styles[`modal__status--${invoice.status}`]}`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          <div className={styles.modal__footer}>
            <button className={styles.modal__button_close} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewInvoiceModal;
