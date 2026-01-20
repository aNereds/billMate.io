'use client';

import React, { Component } from 'react';
import styles from './NotificationModal.module.scss';

interface Notification {
  id: string;
  type: string;
  enabled: boolean;
  email: boolean;
  sms: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notification: Omit<Notification, 'id'>) => void;
  notification: Notification | null;
}

interface NotificationModalState {
  formData: {
    type: string;
    enabled: boolean;
    email: boolean;
    sms: boolean;
  };
  errors: {
    type?: string;
  };
}

class NotificationModal extends Component<
  NotificationModalProps,
  NotificationModalState
> {
  constructor(props: NotificationModalProps) {
    super(props);
    this.state = {
      formData: {
        type: '',
        enabled: true,
        email: true,
        sms: false,
      },
      errors: {},
    };
  }

  componentDidUpdate(prevProps: NotificationModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      if (this.props.notification) {
        this.setState({
          formData: {
            type: this.props.notification.type,
            enabled: this.props.notification.enabled,
            email: this.props.notification.email,
            sms: this.props.notification.sms,
          },
          errors: {},
        });
      } else {
        this.setState({
          formData: {
            type: '',
            enabled: true,
            email: true,
            sms: false,
          },
          errors: {},
        });
      }
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

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: type === 'checkbox' ? checked : value,
      },
      errors: {
        ...prevState.errors,
        [name]: undefined,
      },
    }));
  };

  validate = (): boolean => {
    const { formData } = this.state;
    const errors: NotificationModalState['errors'] = {};

    if (!formData.type.trim()) {
      errors.type = 'Notification type is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSave = () => {
    if (!this.validate()) {
      return;
    }

    this.props.onSave(this.state.formData);
  };

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen, notification } = this.props;
    const { formData, errors } = this.state;

    if (!isOpen) return null;

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>
              {notification ? 'Edit Notification' : 'Add Notification'}
            </h2>
            <button
              className={styles.modal__close}
              onClick={this.props.onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.modal__body}>
            <div className={styles.modal__form_group}>
              <label htmlFor="type" className={styles.modal__label}>
                Notification Type *
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.type ? styles['modal__input--error'] : ''
                }`}
                placeholder="e.g., Invoice Status Change"
              />
              {errors.type && (
                <span className={styles.modal__error}>{errors.type}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label className={styles.modal__checkbox_label}>
                <input
                  type="checkbox"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={this.handleInputChange}
                  className={styles.modal__checkbox}
                />
                <span>Enabled</span>
              </label>
            </div>

            <div className={styles.modal__form_group}>
              <label className={styles.modal__checkbox_label}>
                <input
                  type="checkbox"
                  name="email"
                  checked={formData.email}
                  onChange={this.handleInputChange}
                  className={styles.modal__checkbox}
                />
                <span>Send Email</span>
              </label>
            </div>

            <div className={styles.modal__form_group}>
              <label className={styles.modal__checkbox_label}>
                <input
                  type="checkbox"
                  name="sms"
                  checked={formData.sms}
                  onChange={this.handleInputChange}
                  className={styles.modal__checkbox}
                />
                <span>Send SMS</span>
              </label>
            </div>
          </div>

          <div className={styles.modal__footer}>
            <button
              className={styles.modal__button_cancel}
              onClick={this.props.onClose}
            >
              Cancel
            </button>
            <button
              className={styles.modal__button_save}
              onClick={this.handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NotificationModal;
