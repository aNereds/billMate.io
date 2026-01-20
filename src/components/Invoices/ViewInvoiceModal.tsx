'use client';

import React, { Component } from 'react';
import styles from './ViewInvoiceModal.module.scss';
import { Invoice } from '@/data/mockData';

interface ViewInvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

class ViewInvoiceModal extends Component<ViewInvoiceModalProps> {
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

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { invoice } = this.props;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Invoice Details</h2>
            <button
              className={styles.modal__close}
              onClick={this.props.onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.modal__body}>
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Invoice ID:</span>
              <span className={styles.modal__detail_value}>{invoice.invoiceId}</span>
            </div>
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Company:</span>
              <span className={styles.modal__detail_value}>{invoice.company}</span>
            </div>
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Amount:</span>
              <span className={styles.modal__detail_value}>
                €{invoice.amount.toLocaleString()}
              </span>
            </div>
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Due Date:</span>
              <span className={styles.modal__detail_value}>{invoice.dueDate}</span>
            </div>
            {invoice.date && (
              <div className={styles.modal__detail_row}>
                <span className={styles.modal__detail_label}>Date:</span>
                <span className={styles.modal__detail_value}>{invoice.date}</span>
              </div>
            )}
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Status:</span>
              <span
                className={`${styles.modal__status} ${styles[`modal__status--${invoice.status}`]}`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          <div className={styles.modal__footer}>
            <button className={styles.modal__button_close} onClick={this.props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewInvoiceModal;
