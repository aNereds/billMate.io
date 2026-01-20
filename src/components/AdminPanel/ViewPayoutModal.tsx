'use client';

import React, { Component } from 'react';
import styles from './ViewPayoutModal.module.scss';
import { Payout } from '@/data/mockData';

interface ViewPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: Payout | null;
}

class ViewPayoutModal extends Component<ViewPayoutModalProps> {
  componentDidUpdate(prevProps: ViewPayoutModalProps) {
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
    const { isOpen, payout, onClose } = this.props;

    if (!isOpen || !payout) return null;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Payout Details</h2>
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
              <p className={styles.modal__value}>
                €{payout.amount.toLocaleString()}
              </p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Date</label>
              <p className={styles.modal__value}>{payout.date}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Status</label>
              <span
                className={`${styles.modal__status} ${styles[`modal__status--${payout.status}`]}`}
              >
                {payout.status}
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

export default ViewPayoutModal;
