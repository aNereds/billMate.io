'use client';

import React, { Component } from 'react';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

class DeleteConfirmModal extends Component<DeleteConfirmModalProps> {
  componentDidUpdate(prevProps: DeleteConfirmModalProps) {
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
    const { isOpen, onClose, onConfirm, title, message, itemName } = this.props;

    if (!isOpen) return null;

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
            <div className={styles.modal__icon}>⚠️</div>
            <p className={styles.modal__message}>{message}</p>
            {itemName && (
              <p className={styles.modal__item_name}>{itemName}</p>
            )}
            <p className={styles.modal__warning}>
              This action cannot be undone.
            </p>
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
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteConfirmModal;
