'use client';

import React, { Component } from 'react';
import styles from './ProcessPayoutModal.module.scss';
import { Payout } from '@/data/mockData';

interface ProcessPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  payout: Payout | null;
}

class ProcessPayoutModal extends Component<ProcessPayoutModalProps> {
  componentDidUpdate(prevProps: ProcessPayoutModalProps) {
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
    const { isOpen, payout, onClose, onConfirm } = this.props;

    if (!isOpen || !payout) return null;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Process Payout</h2>
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
              <label className={styles.modal__label}>Payout ID</label>
              <p className={styles.modal__value}>{payout.payoutId}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Client</label>
              <p className={styles.modal__value}>{payout.client}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Invoice ID</label>
              <p className={styles.modal__value}>{payout.invoiceId}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Amount</label>
              <p className={styles.modal__value_amount}>
                €{payout.amount.toLocaleString()}
              </p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Date</label>
              <p className={styles.modal__value}>{payout.date}</p>
            </div>

            <div className={styles.modal__warning}>
              <p>
                Are you sure you want to process this payout? This action will change the payout status to processing and initiate the payment transfer.
              </p>
            </div>
          </div>

          <div className={styles.modal__footer}>
            <button
              className={styles.modal__button_cancel}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={styles.modal__button_confirm}
              onClick={onConfirm}
            >
              Process Payout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProcessPayoutModal;
