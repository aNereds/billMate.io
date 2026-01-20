'use client';

import React, { Component } from 'react';
import styles from './ReviewClientModal.module.scss';
import { Client } from '@/data/mockData';

interface ReviewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (clientId: string) => void;
  onReject: (clientId: string) => void;
  client: Client | null;
}

class ReviewClientModal extends Component<ReviewClientModalProps> {
  componentDidUpdate(prevProps: ReviewClientModalProps) {
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

  handleApprove = () => {
    if (this.props.client) {
      this.props.onApprove(this.props.client.id);
    }
  };

  handleReject = () => {
    if (this.props.client) {
      this.props.onReject(this.props.client.id);
    }
  };

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen, client, onClose } = this.props;

    if (!isOpen || !client) return null;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Review Client</h2>
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
              <label className={styles.modal__label}>Client Name</label>
              <p className={styles.modal__value}>{client.name}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Email</label>
              <p className={styles.modal__value}>{client.email}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Country</label>
              <p className={styles.modal__value}>{client.country}</p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Credit Limit</label>
              <p className={styles.modal__value}>
                €{client.creditLimit.toLocaleString()}
              </p>
            </div>

            <div className={styles.modal__info_group}>
              <label className={styles.modal__label}>Current Status</label>
              <span className={`${styles.modal__status} ${styles['modal__status--pending']}`}>
                {client.status}
              </span>
            </div>

            <div className={styles.modal__warning}>
              <p>Please review the client information and decide whether to approve or reject the application.</p>
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
              className={styles.modal__button_reject}
              onClick={this.handleReject}
            >
              Reject
            </button>
            <button
              className={styles.modal__button_approve}
              onClick={this.handleApprove}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewClientModal;
