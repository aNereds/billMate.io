'use client';

import React, { Component } from 'react';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

class DeleteConfirmModal extends Component<DeleteConfirmModalProps> {
  componentDidMount() {
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.props.onCancel();
    }
  };

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onCancel();
    }
  };

  render() {
    const { title, message, onConfirm, onCancel } = this.props;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>{title}</h2>
            <button
              className={styles.modal__close}
              onClick={onCancel}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.modal__body}>
            <div className={styles.modal__icon}>⚠️</div>
            <p className={styles.modal__message}>{message}</p>
            <p className={styles.modal__warning}>
              This action cannot be undone.
            </p>
          </div>

          <div className={styles.modal__footer}>
            <button
              className={styles.modal__button_cancel}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={styles.modal__button_confirm}
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteConfirmModal;
