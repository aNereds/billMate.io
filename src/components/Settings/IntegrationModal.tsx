'use client';

import React, { Component } from 'react';
import styles from './IntegrationModal.module.scss';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  apiKey?: string;
}

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (integration: Omit<Integration, 'id'>) => void;
  integration: Integration | null;
}

interface IntegrationModalState {
  formData: {
    name: string;
    type: string;
    status: 'active' | 'inactive';
    apiKey: string;
  };
  errors: {
    name?: string;
    type?: string;
  };
}

class IntegrationModal extends Component<
  IntegrationModalProps,
  IntegrationModalState
> {
  constructor(props: IntegrationModalProps) {
    super(props);
    this.state = {
      formData: {
        name: '',
        type: 'API',
        status: 'active',
        apiKey: '',
      },
      errors: {},
    };
  }

  componentDidUpdate(prevProps: IntegrationModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      if (this.props.integration) {
        this.setState({
          formData: {
            name: this.props.integration.name,
            type: this.props.integration.type,
            status: this.props.integration.status,
            apiKey: this.props.integration.apiKey || '',
          },
          errors: {},
        });
      } else {
        this.setState({
          formData: {
            name: '',
            type: 'API',
            status: 'active',
            apiKey: '',
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

  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: undefined,
      },
    }));
  };

  validate = (): boolean => {
    const { formData } = this.state;
    const errors: IntegrationModalState['errors'] = {};

    if (!formData.name.trim()) {
      errors.name = 'Integration name is required';
    }

    if (!formData.type) {
      errors.type = 'Integration type is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSave = () => {
    if (!this.validate()) {
      return;
    }

    const { apiKey, ...rest } = this.state.formData;
    this.props.onSave({
      ...rest,
      ...(apiKey ? { apiKey } : {}),
    });
  };

  handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen, integration } = this.props;
    const { formData, errors } = this.state;

    if (!isOpen) return null;

    const integrationTypes = ['API', 'SMTP', 'Webhook', 'OAuth', 'Other'];

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>
              {integration ? 'Edit Integration' : 'Add Integration'}
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
              <label htmlFor="name" className={styles.modal__label}>
                Integration Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={this.handleInputChange}
                className={`${styles.modal__input} ${
                  errors.name ? styles['modal__input--error'] : ''
                }`}
                placeholder="e.g., Accounting System"
              />
              {errors.name && (
                <span className={styles.modal__error}>{errors.name}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="type" className={styles.modal__label}>
                Integration Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={this.handleInputChange}
                className={`${styles.modal__select} ${
                  errors.type ? styles['modal__select--error'] : ''
                }`}
              >
                {integrationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <span className={styles.modal__error}>{errors.type}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="status" className={styles.modal__label}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={this.handleInputChange}
                className={styles.modal__select}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="apiKey" className={styles.modal__label}>
                API Key (optional)
              </label>
              <input
                type="text"
                id="apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={this.handleInputChange}
                className={styles.modal__input}
                placeholder="Enter API key"
              />
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

export default IntegrationModal;
