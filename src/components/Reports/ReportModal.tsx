'use client';

import React, { Component } from 'react';
import styles from './ReportModal.module.scss';

interface Report {
  id: string;
  name: string;
  type: string;
  period: string;
  status: 'scheduled' | 'completed' | 'failed';
  lastRun?: string;
  nextRun?: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: Omit<Report, 'id'>) => void;
  report: Report | null;
}

interface ReportModalState {
  formData: {
    name: string;
    type: string;
    period: string;
    status: 'scheduled' | 'completed' | 'failed';
  };
  errors: {
    name?: string;
    type?: string;
    period?: string;
  };
}

class ReportModal extends Component<ReportModalProps, ReportModalState> {
  constructor(props: ReportModalProps) {
    super(props);
    this.state = {
      formData: {
        name: '',
        type: 'Financial',
        period: 'Monthly',
        status: 'scheduled',
      },
      errors: {},
    };
  }

  componentDidUpdate(prevProps: ReportModalProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      if (this.props.report) {
        this.setState({
          formData: {
            name: this.props.report.name,
            type: this.props.report.type,
            period: this.props.report.period,
            status: this.props.report.status,
          },
          errors: {},
        });
      } else {
        this.setState({
          formData: {
            name: '',
            type: 'Financial',
            period: 'Monthly',
            status: 'scheduled',
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
    const errors: ReportModalState['errors'] = {};

    if (!formData.name.trim()) {
      errors.name = 'Report name is required';
    }

    if (!formData.type) {
      errors.type = 'Report type is required';
    }

    if (!formData.period) {
      errors.period = 'Period is required';
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
    const { isOpen, report } = this.props;
    const { formData, errors } = this.state;

    if (!isOpen) return null;

    const reportTypes = ['Financial', 'Invoice', 'Debtor', 'Payment', 'Custom'];
    const periods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
    const statuses: ('scheduled' | 'completed' | 'failed')[] = [
      'scheduled',
      'completed',
      'failed',
    ];

    return (
      <div className={styles.modal} onClick={this.handleClose}>
        <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>
              {report ? 'Edit Report' : 'Create Report'}
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
                Report Name *
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
                placeholder="e.g., Monthly Financial Summary"
              />
              {errors.name && (
                <span className={styles.modal__error}>{errors.name}</span>
              )}
            </div>

            <div className={styles.modal__form_group}>
              <label htmlFor="type" className={styles.modal__label}>
                Report Type *
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
                {reportTypes.map((type) => (
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
              <label htmlFor="period" className={styles.modal__label}>
                Period *
              </label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={this.handleInputChange}
                className={`${styles.modal__select} ${
                  errors.period ? styles['modal__select--error'] : ''
                }`}
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
              {errors.period && (
                <span className={styles.modal__error}>{errors.period}</span>
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
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
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

export default ReportModal;
