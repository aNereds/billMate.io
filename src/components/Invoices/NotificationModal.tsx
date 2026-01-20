'use client';

import React, { Component } from 'react';
import styles from './NotificationModal.module.scss';

interface NotificationModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

class NotificationModal extends Component<NotificationModalProps> {
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
    const { title, message, onClose } = this.props;

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
            <div className={styles.modal__icon}>ℹ️</div>
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
