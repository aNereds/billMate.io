'use client';

import React, { Component } from 'react';
import styles from './Step4Contract.module.scss';

interface Step4ContractProps {
  formData: {
    contractAgreed: boolean;
    termsAgreed: boolean;
    policyAgreed: boolean;
  };
  onDataChange: (data: {
    contractAgreed: boolean;
    termsAgreed: boolean;
    policyAgreed: boolean;
  }) => void;
  onComplete: () => void;
}

interface Step4ContractState {
  expandedSections: {
    contract: boolean;
    terms: boolean;
    policy: boolean;
  };
  showNotification: boolean;
  notificationMessage: string;
}

class Step4Contract extends Component<Step4ContractProps, Step4ContractState> {
  private notificationTimeout: NodeJS.Timeout | null = null;

  constructor(props: Step4ContractProps) {
    super(props);
    this.state = {
      expandedSections: {
        contract: true,
        terms: false,
        policy: false,
      },
      showNotification: false,
      notificationMessage: '',
    };
  }

  componentDidMount() {
    // Listen for validation notification event
    window.addEventListener('showValidationNotification', this.handleNotificationEvent);
  }

  componentWillUnmount() {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    window.removeEventListener('showValidationNotification', this.handleNotificationEvent);
  }

  handleNotificationEvent = (event: any) => {
    const message = event.detail?.message || 'Please confirm all agreements';
    this.showNotification(message);
  };

  toggleSection = (section: keyof Step4ContractState['expandedSections']) => {
    this.setState((prevState) => ({
      expandedSections: {
        ...prevState.expandedSections,
        [section]: !prevState.expandedSections[section],
      },
    }));
  };

  handleCheckboxChange = (
    field: 'contractAgreed' | 'termsAgreed' | 'policyAgreed',
    checked: boolean
  ) => {
    this.props.onDataChange({
      ...this.props.formData,
      [field]: checked,
    });
  };

  showNotification = (message: string) => {
    this.setState({ showNotification: true, notificationMessage: message });

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.setState({ showNotification: false });
    }, 5000);
  };


  render() {
    const { formData } = this.props;
    const { expandedSections, showNotification, notificationMessage } =
      this.state;

    const allAgreed =
      formData.contractAgreed &&
      formData.termsAgreed &&
      formData.policyAgreed;

    return (
      <div className={styles.step4}>
        {showNotification && (
          <div className={styles.step4__notification}>
            <span className={styles.step4__notification_icon}>⚠️</span>
            <span className={styles.step4__notification_text}>
              {notificationMessage}
            </span>
          </div>
        )}

        <div className={styles.step4__status}>
          <span className={styles.step4__status_icon}>✓</span>
          <span className={styles.step4__status_text}>Documents Ready</span>
        </div>

        <div className={styles.step4__sections}>
          <div
            className={`${styles.step4__section} ${
              !formData.contractAgreed ? styles['step4__section--warning'] : ''
            }`}
          >
            <div
              className={styles.step4__section_header}
              onClick={() => this.toggleSection('contract')}
            >
              <h3 className={styles.step4__section_title}>
                FACTORING CONTRACT
              </h3>
              <span className={styles.step4__section_toggle}>
                {expandedSections.contract ? '▼' : '▶'}
              </span>
            </div>
            {expandedSections.contract && (
              <div className={styles.step4__section_content}>
                <div className={styles.step4__section_item}>
                  <strong>1. PARTIES:</strong>
                  <p>
                    This Factoring Agreement is entered into between BillMate.io
                    AS (the "Factor") and the Client (the "Creditor") as
                    identified in the registration process.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>2. DEFINITIONS:</strong>
                  <p>
                    "Factoring" means the purchase of accounts receivable by the
                    Factor from the Creditor. "Invoice" means any valid invoice
                    issued by the Creditor to a Debtor. "Debtor" means any party
                    listed in the approved debtor list.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>3. TERMS AND CONDITIONS:</strong>
                  <p>
                    The Factor agrees to purchase accounts receivable from the
                    Creditor subject to the terms and conditions set forth in
                    this Agreement. The Creditor warrants that all invoices are
                    valid, genuine, and represent bona fide sales of goods or
                    services.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>4. PAYMENT TERMS:</strong>
                  <p>
                    Payment will be made to the Creditor within the agreed
                    timeframe upon verification of the invoice and debtor
                    approval. The Factor reserves the right to verify all
                    documentation before processing payment.
                  </p>
                </div>
                <div
                  className={`${styles.step4__checkbox} ${
                    !formData.contractAgreed
                      ? styles['step4__checkbox--warning']
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    id="contract-agree"
                    checked={formData.contractAgreed}
                    onChange={(e) =>
                      this.handleCheckboxChange('contractAgreed', e.target.checked)
                    }
                    className={styles.step4__checkbox_input}
                  />
                  <label
                    htmlFor="contract-agree"
                    className={styles.step4__checkbox_label}
                  >
                    I agree to the Factoring Contract
                  </label>
                </div>
              </div>
            )}
          </div>

          <div
            className={`${styles.step4__section} ${
              !formData.termsAgreed ? styles['step4__section--warning'] : ''
            }`}
          >
            <div
              className={styles.step4__section_header}
              onClick={() => this.toggleSection('terms')}
            >
              <h3 className={styles.step4__section_title}>Contract terms</h3>
              <span className={styles.step4__section_toggle}>
                {expandedSections.terms ? '▼' : '▶'}
              </span>
            </div>
            {expandedSections.terms && (
              <div className={styles.step4__section_content}>
                <div className={styles.step4__section_item}>
                  <strong>1. CREDIT LIMITS:</strong>
                  <p>
                    The Factor will establish credit limits for each approved
                    Debtor. The Creditor agrees not to submit invoices exceeding
                    these limits without prior written approval from the Factor.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>2. RECOURSE AND NON-RECOURSE:</strong>
                  <p>
                    This Agreement may include both recourse and non-recourse
                    factoring arrangements as specified in individual transaction
                    documentation. The Creditor understands the implications of
                    each arrangement.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>3. FEES AND CHARGES:</strong>
                  <p>
                    The Factor will charge fees as agreed in the fee schedule
                    provided separately. All fees are calculated based on the
                    invoice amount and payment terms. The Creditor acknowledges
                    receipt and understanding of the fee structure.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>4. REPORTING REQUIREMENTS:</strong>
                  <p>
                    The Creditor agrees to provide regular reports and
                    documentation as requested by the Factor, including but not
                    limited to aging reports, sales ledgers, and debtor
                    statements.
                  </p>
                </div>
                <div
                  className={`${styles.step4__checkbox} ${
                    !formData.termsAgreed
                      ? styles['step4__checkbox--warning']
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    id="terms-agree"
                    checked={formData.termsAgreed}
                    onChange={(e) =>
                      this.handleCheckboxChange('termsAgreed', e.target.checked)
                    }
                    className={styles.step4__checkbox_input}
                  />
                  <label
                    htmlFor="terms-agree"
                    className={styles.step4__checkbox_label}
                  >
                    I agree to the Contract Terms
                  </label>
                </div>
              </div>
            )}
          </div>

          <div
            className={`${styles.step4__section} ${
              !formData.policyAgreed ? styles['step4__section--warning'] : ''
            }`}
          >
            <div
              className={styles.step4__section_header}
              onClick={() => this.toggleSection('policy')}
            >
              <h3 className={styles.step4__section_title}>
                Additional Policy
              </h3>
              <span className={styles.step4__section_toggle}>
                {expandedSections.policy ? '▼' : '▶'}
              </span>
            </div>
            {expandedSections.policy && (
              <div className={styles.step4__section_content}>
                <div className={styles.step4__section_item}>
                  <strong>1. DATA PROTECTION:</strong>
                  <p>
                    Both parties agree to comply with all applicable data
                    protection regulations, including GDPR. Personal data will be
                    processed only for the purposes of this Agreement and in
                    accordance with the privacy policy provided.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>2. CONFIDENTIALITY:</strong>
                  <p>
                    All information exchanged between the parties shall be treated
                    as confidential. Neither party shall disclose confidential
                    information to third parties without prior written consent,
                    except as required by law or regulatory authorities.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>3. DISPUTE RESOLUTION:</strong>
                  <p>
                    Any disputes arising from this Agreement shall be resolved
                    through good faith negotiations. If resolution cannot be
                    reached, disputes shall be submitted to binding arbitration
                    in accordance with the rules of the relevant arbitration
                    institution.
                  </p>
                </div>
                <div className={styles.step4__section_item}>
                  <strong>4. TERMINATION:</strong>
                  <p>
                    Either party may terminate this Agreement with 30 days written
                    notice. Upon termination, all outstanding obligations shall
                    remain in effect until fully satisfied. The Factor reserves
                    the right to terminate immediately in case of material breach.
                  </p>
                </div>
                <div
                  className={`${styles.step4__checkbox} ${
                    !formData.policyAgreed
                      ? styles['step4__checkbox--warning']
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    id="policy-agree"
                    checked={formData.policyAgreed}
                    onChange={(e) =>
                      this.handleCheckboxChange('policyAgreed', e.target.checked)
                    }
                    className={styles.step4__checkbox_input}
                  />
                  <label
                    htmlFor="policy-agree"
                    className={styles.step4__checkbox_label}
                  >
                    I agree to the Additional Policy
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Step4Contract;
