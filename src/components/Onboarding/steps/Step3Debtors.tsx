'use client';

import React, { Component } from 'react';
import styles from './Step3Debtors.module.scss';

interface Debtor {
  companyName: string;
  country: string;
  registrationNumber: string;
  creditLimit: string;
}

interface Step3DebtorsProps {
  formData: {
    debtors: Debtor[];
  };
  onDataChange: (data: { debtors: Debtor[] }) => void;
}

class Step3Debtors extends Component<Step3DebtorsProps> {
  handleInputChange = (
    index: number,
    field: keyof Debtor,
    value: string
  ) => {
    const { debtors } = this.props.formData;
    const newDebtors = [...debtors];
    newDebtors[index] = { ...newDebtors[index], [field]: value };
    this.props.onDataChange({ debtors: newDebtors });
  };

  handleAddDebtor = () => {
    const { debtors } = this.props.formData;
    this.props.onDataChange({
      debtors: [
        ...debtors,
        {
          companyName: '',
          country: '',
          registrationNumber: '',
          creditLimit: '',
        },
      ],
    });
  };

  handleRemoveDebtor = (index: number) => {
    const { debtors } = this.props.formData;
    const newDebtors = debtors.filter((_, i) => i !== index);
    this.props.onDataChange({ debtors: newDebtors });
  };

  render() {
    const { debtors } = this.props.formData;
    const countries = ['Latvia', 'Estonia', 'Lithuania', 'Finland', 'Sweden'];

    return (
      <div className={styles.step3}>
        <h2 className={styles.step3__title}>Debtor List</h2>
        <p className={styles.step3__description}>
          Add companies that will be your debtors
        </p>

        {debtors.length === 0 ? (
          <div className={styles.step3__debtor}>
            <div className={styles.step3__debtor_row}>
              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>
                  Company Name
                </label>
                <input
                  type="text"
                  value=""
                  onChange={() => {}}
                  className={styles.step3__form_input}
                  placeholder="Enter company name"
                  disabled
                />
              </div>

              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>Country</label>
                <select
                  value=""
                  onChange={() => {}}
                  className={styles.step3__form_select}
                  disabled
                >
                  <option value="">Select...</option>
                </select>
              </div>

              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>
                  Registration Number
                </label>
                <input
                  type="text"
                  value=""
                  onChange={() => {}}
                  className={styles.step3__form_input}
                  placeholder="Enter registration number"
                  disabled
                />
              </div>

              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>
                  Credit Limit (EUR)
                </label>
                <input
                  type="number"
                  value=""
                  onChange={() => {}}
                  className={styles.step3__form_input}
                  placeholder="Enter credit limit"
                  disabled
                />
              </div>

              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>&nbsp;</label>
              </div>
            </div>
          </div>
        ) : (
          debtors.map((debtor, index) => (
          <div key={index} className={styles.step3__debtor}>
            <div className={styles.step3__debtor_row}>
              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={debtor.companyName}
                  onChange={(e) =>
                    this.handleInputChange(index, 'companyName', e.target.value)
                  }
                  className={styles.step3__form_input}
                  placeholder="Enter company name"
                />
              </div>

              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>Country</label>
                <select
                  value={debtor.country}
                  onChange={(e) =>
                    this.handleInputChange(index, 'country', e.target.value)
                  }
                  className={styles.step3__form_select}
                >
                  <option value="">Select...</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>
                  Registration Number
                </label>
                <input
                  type="text"
                  value={debtor.registrationNumber}
                  onChange={(e) =>
                    this.handleInputChange(
                      index,
                      'registrationNumber',
                      e.target.value
                    )
                  }
                  className={styles.step3__form_input}
                  placeholder="Enter registration number"
                />
              </div>

              <div className={styles.step3__form_group}>
                <label className={styles.step3__form_label}>
                  Credit Limit (EUR)
                </label>
                <input
                  type="number"
                  value={debtor.creditLimit}
                  onChange={(e) =>
                    this.handleInputChange(index, 'creditLimit', e.target.value)
                  }
                  className={styles.step3__form_input}
                  placeholder="Enter credit limit"
                />
              </div>

              <div className={styles.step3__form_group}>
                {debtors.length > 1 && (
                  <button
                    className={styles.step3__remove_button}
                    onClick={() => this.handleRemoveDebtor(index)}
                    title="Remove debtor"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
          ))
        )}

        <button
          className={styles.step3__add_button}
          onClick={this.handleAddDebtor}
        >
          + Add Another Debtor
        </button>
      </div>
    );
  }
}

export default Step3Debtors;
