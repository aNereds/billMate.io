'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.scss';
import { mockInvoices, mockDebtors, Invoice, Debtor } from '@/data/mockData';
import { authService } from '@/utils/auth';
import { storageService, STORAGE_KEYS } from '@/utils/storage';
import { sampleDataService } from '@/utils/auth';
import AddDebtorModal from './AddDebtorModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import NotificationModal from './NotificationModal';

interface DashboardState {
  invoices: Invoice[];
  debtors: Debtor[];
  showAddInvoice: boolean;
  showAddDebtorModal: boolean;
  showDeleteModal: boolean;
  showNotificationModal: boolean;
  deleteType: 'invoice' | 'debtor' | null;
  deleteId: string | null;
  deleteName: string | null;
  notificationTitle: string;
  notificationMessage: string;
  newInvoice: {
    company: string;
    amount: string;
    dueDate: string;
  };
}

class Dashboard extends Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      invoices: [],
      debtors: [],
      showAddInvoice: false,
      showAddDebtorModal: false,
      showDeleteModal: false,
      showNotificationModal: false,
      deleteType: null,
      deleteId: null,
      deleteName: null,
      notificationTitle: '',
      notificationMessage: '',
      newInvoice: {
        company: '',
        amount: '',
        dueDate: '',
      },
    };
  }

  componentDidMount() {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.href = '/onboarding';
      return;
    }

    // Load data from localStorage or use sample data
    this.loadData();
    
    // Mark sample data
    mockInvoices.forEach((inv) => {
      sampleDataService.markAsSample(inv.id, 'invoice');
    });
    mockDebtors.forEach((deb) => {
      sampleDataService.markAsSample(deb.id, 'debtor');
    });
  }

  loadData = () => {
    // Load invoices from localStorage or use sample
    const storedInvoices = storageService.getItems<Invoice>(STORAGE_KEYS.INVOICES);
    const allInvoices = [...mockInvoices, ...storedInvoices];
    
    // Load debtors from localStorage or use sample
    const storedDebtors = storageService.getItems<Debtor>(STORAGE_KEYS.DEBTORS);
    const allDebtors = [...mockDebtors, ...storedDebtors];

    this.setState({
      invoices: allInvoices,
      debtors: allDebtors,
    });
  };

  handleAddInvoice = () => {
    const { newInvoice, invoices } = this.state;
    if (!newInvoice.company || !newInvoice.amount || !newInvoice.dueDate) {
      this.setState({
        showNotificationModal: true,
        notificationTitle: 'Validation Error',
        notificationMessage: 'Please fill all fields',
      });
      return;
    }

    const newInvoiceItem: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceId: `INV-${Date.now()}`,
      company: newInvoice.company,
      amount: parseFloat(newInvoice.amount),
      dueDate: newInvoice.dueDate,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };

    // Save to localStorage (not sample data)
    storageService.addItem(STORAGE_KEYS.INVOICES, newInvoiceItem);

    this.setState({
      invoices: [...invoices, newInvoiceItem],
      showAddInvoice: false,
      newInvoice: { company: '', amount: '', dueDate: '' },
    });
  };

  handleDeleteInvoice = (id: string) => {
    // Check if it's sample data
    if (sampleDataService.isSample(id, 'invoice')) {
      this.setState({
        showNotificationModal: true,
        notificationTitle: 'Cannot Delete',
        notificationMessage: 'Cannot delete sample data',
      });
      return;
    }

    const invoice = this.state.invoices.find((inv) => inv.id === id);
    if (invoice) {
      this.setState({
        showDeleteModal: true,
        deleteType: 'invoice',
        deleteId: id,
        deleteName: invoice.invoiceId,
      });
    }
  };

  handleRemoveInvoice = (id: string) => {
    storageService.removeItem<Invoice>(STORAGE_KEYS.INVOICES, id);
    this.loadData();
  };

  handleApproveInvoice = (id: string) => {
    const { invoices } = this.state;
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, status: 'approved' as const } : invoice
    );
    
    // Update in localStorage if it's a stored invoice
    const storedInvoices = storageService.getItems<Invoice>(STORAGE_KEYS.INVOICES);
    const isStored = storedInvoices.some((inv) => inv.id === id);
    if (isStored) {
      storageService.updateItem<Invoice>(STORAGE_KEYS.INVOICES, id, {
        status: 'approved',
      });
    }
    
    this.setState({ invoices: updatedInvoices });
  };

  handleBlockInvoice = (id: string) => {
    const { invoices } = this.state;
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, status: 'blocked' as const } : invoice
    );
    
    // Update in localStorage if it's a stored invoice
    const storedInvoices = storageService.getItems<Invoice>(STORAGE_KEYS.INVOICES);
    const isStored = storedInvoices.some((inv) => inv.id === id);
    if (isStored) {
      storageService.updateItem<Invoice>(STORAGE_KEYS.INVOICES, id, {
        status: 'blocked',
      });
    }
    
    this.setState({ invoices: updatedInvoices });
  };

  handleAddDebtor = () => {
    this.setState({ showAddDebtorModal: true });
  };

  handleSaveDebtor = (debtorData: {
    companyName: string;
    country: string;
    registrationNumber: string;
    creditLimit: number;
  }) => {
    const newDebtor: Debtor = {
      id: `DEB-${Date.now()}`,
      companyName: debtorData.companyName,
      country: debtorData.country,
      registrationNumber: debtorData.registrationNumber,
      creditLimit: debtorData.creditLimit,
    };

    storageService.addItem(STORAGE_KEYS.DEBTORS, newDebtor);
    this.loadData();
  };

  handleCloseDebtorModal = () => {
    this.setState({ showAddDebtorModal: false });
  };

  handleDeleteDebtor = (id: string) => {
    // Check if it's sample data
    if (sampleDataService.isSample(id, 'debtor')) {
      this.setState({
        showNotificationModal: true,
        notificationTitle: 'Cannot Delete',
        notificationMessage: 'Cannot delete sample data',
      });
      return;
    }

    const debtor = this.state.debtors.find((deb) => deb.id === id);
    if (debtor) {
      this.setState({
        showDeleteModal: true,
        deleteType: 'debtor',
        deleteId: id,
        deleteName: debtor.companyName,
      });
    }
  };

  handleRemoveDebtor = (id: string) => {
    storageService.removeItem<Debtor>(STORAGE_KEYS.DEBTORS, id);
    this.loadData();
  };

  handleDeleteConfirm = () => {
    const { deleteType, deleteId } = this.state;
    if (!deleteType || !deleteId) return;

    if (deleteType === 'invoice') {
      this.handleRemoveInvoice(deleteId);
    } else if (deleteType === 'debtor') {
      this.handleRemoveDebtor(deleteId);
    }

    this.handleCloseDeleteModal();
  };

  handleCloseDeleteModal = () => {
    this.setState({
      showDeleteModal: false,
      deleteType: null,
      deleteId: null,
      deleteName: null,
    });
  };

  handleCloseNotificationModal = () => {
    this.setState({
      showNotificationModal: false,
      notificationTitle: '',
      notificationMessage: '',
    });
  };

  handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  render() {
    const {
      invoices,
      debtors,
      showAddInvoice,
      showAddDebtorModal,
      showDeleteModal,
      showNotificationModal,
      deleteType,
      deleteId,
      deleteName,
      notificationTitle,
      notificationMessage,
      newInvoice,
    } = this.state;
    
    const unpaidBalance = invoices
      .filter((inv) => inv.status === 'pending' || inv.status === 'processing')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return (
      <div className={styles.dashboard}>
        <header className={styles.dashboard__header}>
          <div className={styles.dashboard__header_container}>
            <div className={styles.dashboard__logo}>BillMate.io</div>
            <nav className={styles.dashboard__nav}>
              <Link
                href="/dashboard/analytics"
                className={styles.dashboard__nav_link}
              >
                Dashboard
              </Link>
              <Link href="/error" className={styles.dashboard__nav_link}>
                Invoices
              </Link>
              <Link href="/error" className={styles.dashboard__nav_link}>
                Debtors
              </Link>
              <Link href="/reports" className={styles.dashboard__nav_link}>
                Reports
              </Link>
              <Link href="/settings" className={styles.dashboard__nav_link}>
                Settings
              </Link>
            </nav>
            <div className={styles.dashboard__user}>
              <span className={styles.dashboard__user_icon}>👤</span>
              <Link href="/admin">Admin</Link>
              <button
                onClick={this.handleLogout}
                className={styles.dashboard__logout_button}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className={styles.dashboard__main}>
          <div className={styles.dashboard__container}>
            <div className={styles.dashboard__grid}>
              <div className={styles.dashboard__card}>
                <h2 className={styles.dashboard__card_title}>Unpaid Balance</h2>
                <div className={styles.dashboard__balance_amount}>
                  €{unpaidBalance.toLocaleString()}
                </div>
                <p className={styles.dashboard__balance_status}>
                  Awaiting processing
                </p>
              </div>

              <div className={styles.dashboard__card}>
                <div className={styles.dashboard__card_header}>
                  <h2 className={styles.dashboard__card_title}>Invoices</h2>
                  <button
                    className={styles.dashboard__add_button}
                    onClick={() =>
                      this.setState({ showAddInvoice: !showAddInvoice })
                    }
                  >
                    + Add
                  </button>
                </div>

                {showAddInvoice && (
                  <div className={styles.dashboard__add_form}>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={newInvoice.company}
                      onChange={(e) =>
                        this.setState({
                          newInvoice: { ...newInvoice, company: e.target.value },
                        })
                      }
                      className={styles.dashboard__form_input}
                    />
                    <input
                      type="number"
                      placeholder="Amount (EUR)"
                      value={newInvoice.amount}
                      onChange={(e) =>
                        this.setState({
                          newInvoice: { ...newInvoice, amount: e.target.value },
                        })
                      }
                      className={styles.dashboard__form_input}
                    />
                    <input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) =>
                        this.setState({
                          newInvoice: { ...newInvoice, dueDate: e.target.value },
                        })
                      }
                      className={styles.dashboard__form_input}
                    />
                    <div className={styles.dashboard__form_actions}>
                      <button
                        className={styles.dashboard__button_save}
                        onClick={this.handleAddInvoice}
                      >
                        Save
                      </button>
                      <button
                        className={styles.dashboard__button_cancel}
                        onClick={() =>
                          this.setState({ showAddInvoice: false })
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.dashboard__table_wrapper}>
                  <table className={styles.dashboard__table}>
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Company</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.slice(0, 10).map((invoice) => (
                        <tr key={invoice.id}>
                          <td>{invoice.invoiceId}</td>
                          <td>{invoice.company}</td>
                          <td>{invoice.dueDate}</td>
                          <td>€{invoice.amount.toLocaleString()}</td>
                          <td>
                            <span
                              className={`${styles.dashboard__status} ${styles[`dashboard__status--${invoice.status}`]}`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                          <td>
                            <div className={styles.dashboard__actions}>
                              <button
                                className={styles.dashboard__approve_button}
                                onClick={() => this.handleApproveInvoice(invoice.id)}
                              >
                                Approve
                              </button>
                              <button
                                className={styles.dashboard__block_button}
                                onClick={() => this.handleBlockInvoice(invoice.id)}
                              >
                                Block
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href="/error" className={styles.dashboard__view_all}>
                  View All →
                </Link>
              </div>

              <div className={styles.dashboard__card}>
                <div className={styles.dashboard__card_header}>
                  <h2 className={styles.dashboard__card_title}>Debtors</h2>
                  <button
                    className={styles.dashboard__view_button}
                    onClick={this.handleAddDebtor}
                  >
                    + Add Debtor
                  </button>
                </div>
                <div className={styles.dashboard__table_wrapper}>
                  <table className={styles.dashboard__table}>
                    <thead>
                      <tr>
                        <th>Debtor</th>
                        <th>Remaining</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debtors.map((debtor) => (
                        <tr key={debtor.id}>
                          <td>{debtor.companyName}</td>
                          <td>€{debtor.creditLimit.toLocaleString()}</td>
                          <td>
                            <div className={styles.dashboard__actions}>
                              <button className={styles.dashboard__action_button}>
                                Increase Credit
                              </button>
                            {!sampleDataService.isSample(debtor.id, 'debtor') && (
                              <button
                                className={styles.dashboard__delete_button}
                                onClick={() => this.handleDeleteDebtor(debtor.id)}
                              >
                                Delete
                              </button>
                            )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>Nordic Trade AS</td>
                        <td>
                          <span
                            className={`${styles.dashboard__status} ${styles['dashboard__status--blocked']}`}
                          >
                            Blocked
                          </span>
                        </td>
                        <td>
                          <div className={styles.dashboard__actions}>
                            <button className={styles.dashboard__action_button}>
                              Increase Credit
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.dashboard__card}>
                <div className={styles.dashboard__card_header}>
                  <h2 className={styles.dashboard__card_title}>Conversations</h2>
                  <button className={styles.dashboard__new_button}>+ New</button>
                </div>
                <ul className={styles.dashboard__conversations}>
                  <li className={styles.dashboard__conversation}>
                    <div className={styles.dashboard__conversation_content}>
                      <span className={styles.dashboard__conversation_title}>
                        Invoice INV-003 Query
                      </span>
                      <span className={styles.dashboard__conversation_date}>
                        2024-01-15
                      </span>
                    </div>
                    <button className={styles.dashboard__conversation_new}>
                      New
                    </button>
                  </li>
                  <li className={styles.dashboard__conversation}>
                    <div className={styles.dashboard__conversation_content}>
                      <span className={styles.dashboard__conversation_title}>
                        Payment Confirmation
                      </span>
                      <span className={styles.dashboard__conversation_date}>
                        2024-01-14
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <AddDebtorModal
          isOpen={showAddDebtorModal}
          onClose={this.handleCloseDebtorModal}
          onSave={this.handleSaveDebtor}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={this.handleCloseDeleteModal}
          onConfirm={this.handleDeleteConfirm}
          title="Confirm Delete"
          message={
            deleteType === 'invoice'
              ? 'Are you sure you want to delete this invoice?'
              : 'Are you sure you want to delete this debtor?'
          }
          itemName={deleteName || undefined}
        />

        <NotificationModal
          isOpen={showNotificationModal}
          onClose={this.handleCloseNotificationModal}
          title={notificationTitle}
          message={notificationMessage}
          type="warning"
        />
      </div>
    );
  }
}

export default Dashboard;
