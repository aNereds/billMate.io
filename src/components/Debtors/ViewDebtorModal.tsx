'use client';

import React, { Component } from 'react';
import styles from './ViewDebtorModal.module.scss';
import { Debtor } from '@/data/mockData';

interface ViewDebtorModalProps {
  debtor: Debtor;
  onClose: () => void;
}

class ViewDebtorModal extends Component<ViewDebtorModalProps> {
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
    const { debtor } = this.props;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Debtor Details</h2>
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
              <span className={styles.modal__detail_label}>Company Name:</span>
              <span className={styles.modal__detail_value}>{debtor.companyName}</span>
            </div>
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Country:</span>
              <span className={styles.modal__detail_value}>{debtor.country}</span>
            </div>
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Registration Number:</span>
              <span className={styles.modal__detail_value}>
                {debtor.registrationNumber}
              </span>
            </div>
            <div className={styles.modal__detail_row}>
              <span className={styles.modal__detail_label}>Credit Limit:</span>
              <span className={styles.modal__detail_value}>
                €{debtor.creditLimit.toLocaleString()}
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

export default ViewDebtorModal;
