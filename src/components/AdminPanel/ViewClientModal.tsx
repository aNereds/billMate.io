'use client';

import React, { Component } from 'react';
import styles from './ViewClientModal.module.scss';
import { Client } from '@/data/mockData';

interface ViewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

class ViewClientModal extends Component<ViewClientModalProps> {
  componentDidUpdate(prevProps: ViewClientModalProps) {
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
    const { isOpen, client, onClose } = this.props;

    if (!isOpen || !client) return null;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>Client Details</h2>
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
              <label className={styles.modal__label}>Status</label>
              <span
                className={`${styles.modal__status} ${styles[`modal__status--${client.status}`]}`}
              >
                {client.status}
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

export default ViewClientModal;
