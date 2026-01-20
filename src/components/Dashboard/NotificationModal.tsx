'use client';

import React, { Component } from 'react';
import styles from './NotificationModal.module.scss';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

class NotificationModal extends Component<NotificationModalProps> {
  componentDidUpdate(prevProps: NotificationModalProps) {
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
    const { isOpen, onClose, title, message, type = 'info' } = this.props;

    if (!isOpen) return null;

    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };

    const colors = {
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      success: '#10b981',
    };

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>{title}</h2>
            <button
              className={styles.modal__close}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.modal__body}>
            <div
              className={styles.modal__icon}
              style={{ color: colors[type] }}
            >
              {icons[type]}
            </div>
            <p className={styles.modal__message}>{message}</p>
          </div>

          <div className={styles.modal__footer}>
            <button className={styles.modal__button_close} onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NotificationModal;
