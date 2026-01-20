'use client';

import React, { Component } from 'react';
import styles from './ApproveRejectModal.module.scss';
import { Invoice } from '@/data/mockData';

interface ApproveRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  invoice: Invoice | null;
  type: 'approve' | 'reject';
}

class ApproveRejectModal extends Component<ApproveRejectModalProps> {
  componentDidUpdate(prevProps: ApproveRejectModalProps) {
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
    const { isOpen, invoice, onClose, onApprove, onReject, type } = this.props;

    if (!isOpen || !invoice) return null;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>
              {type === 'approve' ? 'Approve Invoice' : 'Reject Invoice'}
            </h2>
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

            <div className={styles.modal__warning}>
              <p>
                {type === 'approve'
                  ? 'Are you sure you want to approve this invoice? This action will change the invoice status to approved.'
                  : 'Are you sure you want to reject this invoice? This action will change the invoice status to rejected.'}
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
            {type === 'approve' ? (
              <button
                className={styles.modal__button_approve}
                onClick={onApprove}
              >
                Approve
              </button>
            ) : (
              <button
                className={styles.modal__button_reject}
                onClick={onReject}
              >
                Reject
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ApproveRejectModal;
