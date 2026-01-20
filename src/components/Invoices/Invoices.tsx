'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './Invoices.module.scss';
import { authService } from '@/utils/auth';
import { storageService, STORAGE_KEYS } from '@/utils/storage';
import { sampleDataService } from '@/utils/auth';
import { mockInvoices, Invoice } from '@/data/mockData';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import AddInvoiceModal from './AddInvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';
import ViewInvoiceModal from './ViewInvoiceModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import NotificationModal from './NotificationModal';

interface InvoicesState {
  invoices: Invoice[];
  showAddModal: boolean;
  showEditModal: boolean;
  showViewModal: boolean;
  showDeleteModal: boolean;
  showNotificationModal: boolean;
  editingInvoice: Invoice | null;
  viewingInvoice: Invoice | null;
  deleteId: string | null;
  deleteName: string | null;
  notificationTitle: string;
  notificationMessage: string;
  isMobileMenuOpen: boolean;
  selectedPeriod: 'week' | 'month' | 'quarter' | 'year';
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

class Invoices extends Component<{}, InvoicesState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      invoices: [],
      showAddModal: false,
      showEditModal: false,
      showViewModal: false,
      showDeleteModal: false,
      showNotificationModal: false,
      editingInvoice: null,
      viewingInvoice: null,
      deleteId: null,
      deleteName: null,
      notificationTitle: '',
      notificationMessage: '',
      isMobileMenuOpen: false,
      selectedPeriod: 'month',
    };
  }

  componentDidMount() {
    if (!authService.isAuthenticated()) {
      window.location.href = '/onboarding';
      return;
    }

    this.loadData();

    // Mark sample data
    mockInvoices.forEach((inv) => {
      sampleDataService.markAsSample(inv.id, 'invoice');
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (window.innerWidth > 1024) {
      this.setState({ isMobileMenuOpen: false });
    }
  };

  handleToggleMobileMenu = () => {
    this.setState((prevState) => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }));
  };

  handleCloseMobileMenu = () => {
    this.setState({ isMobileMenuOpen: false });
  };

  loadData = () => {
    const storedInvoices = storageService.getItems<Invoice>(STORAGE_KEYS.INVOICES);
    this.setState({
      invoices: storedInvoices.length > 0 ? storedInvoices : mockInvoices,
    });
  };

  handleAddInvoice = () => {
    this.setState({ showAddModal: true });
  };

  handleEditInvoice = (invoice: Invoice) => {
    this.setState({
      editingInvoice: invoice,
      showEditModal: true,
    });
  };

  handleViewInvoice = (invoice: Invoice) => {
    this.setState({
      viewingInvoice: invoice,
      showViewModal: true,
    });
  };

  handleDeleteInvoice = (id: string, name: string) => {
    if (sampleDataService.isSample(id, 'invoice')) {
      this.setState({
        notificationTitle: 'Cannot Delete',
        notificationMessage: 'Sample data cannot be deleted.',
        showNotificationModal: true,
      });
      return;
    }

    this.setState({
      deleteId: id,
      deleteName: name,
      showDeleteModal: true,
    });
  };

  handleConfirmDelete = () => {
    const { deleteId } = this.state;
    if (!deleteId) return;

    const updatedInvoices = this.state.invoices.filter((inv) => inv.id !== deleteId);
    this.setState({ invoices: updatedInvoices });
    storageService.saveItems(STORAGE_KEYS.INVOICES, updatedInvoices);
    this.handleCloseDeleteModal();
  };

  handleCloseAddModal = () => {
    this.setState({ showAddModal: false });
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, editingInvoice: null });
  };

  handleCloseViewModal = () => {
    this.setState({ showViewModal: false, viewingInvoice: null });
  };

  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteId: null, deleteName: null });
  };

  handleCloseNotificationModal = () => {
    this.setState({
      showNotificationModal: false,
      notificationTitle: '',
      notificationMessage: '',
    });
  };

  handleSaveInvoice = (invoiceData: Partial<Invoice>) => {
    const { editingInvoice } = this.state;
    let updatedInvoices: Invoice[];

    if (editingInvoice) {
      updatedInvoices = this.state.invoices.map((inv) =>
        inv.id === editingInvoice.id
          ? { ...inv, ...invoiceData }
          : inv
      );
    } else {
      const newInvoice: Invoice = {
        id: `INV-${Date.now()}`,
        invoiceId: `INV-${Date.now()}`,
        company: invoiceData.company || '',
        dueDate: invoiceData.dueDate || '',
        amount: invoiceData.amount || 0,
        status: invoiceData.status || 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      updatedInvoices = [...this.state.invoices, newInvoice];
    }

    this.setState({ invoices: updatedInvoices });
    storageService.saveItems(STORAGE_KEYS.INVOICES, updatedInvoices);
    this.handleCloseAddModal();
    this.handleCloseEditModal();
  };

  handlePeriodChange = (period: 'week' | 'month' | 'quarter' | 'year') => {
    this.setState({ selectedPeriod: period });
  };

  handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  getStatusData = () => {
    const { invoices, selectedPeriod } = this.state;
    
    // Base counts from actual data
    const baseStatusCounts: Record<string, number> = {
      approved: 0,
      processing: 0,
      pending: 0,
      paid: 0,
      rejected: 0,
      blocked: 0,
    };

    invoices.forEach((inv) => {
      baseStatusCounts[inv.status] = (baseStatusCounts[inv.status] || 0) + 1;
    });

    // Multipliers for different periods (simulating different time ranges)
    const periodMultipliers: Record<string, Record<string, number>> = {
      week: {
        approved: 0.7,
        processing: 0.8,
        pending: 0.9,
        paid: 0.6,
        rejected: 0.5,
        blocked: 0.5,
      },
      month: {
        approved: 1.0,
        processing: 1.0,
        pending: 1.0,
        paid: 1.0,
        rejected: 1.0,
        blocked: 1.0,
      },
      quarter: {
        approved: 1.2,
        processing: 1.1,
        pending: 1.15,
        paid: 1.3,
        rejected: 1.1,
        blocked: 1.1,
      },
      year: {
        approved: 1.5,
        processing: 1.4,
        pending: 1.3,
        paid: 1.6,
        rejected: 1.2,
        blocked: 1.2,
      },
    };

    const multipliers = periodMultipliers[selectedPeriod] || periodMultipliers.month;

    return [
      { 
        name: 'Approved', 
        value: Math.round(baseStatusCounts.approved * multipliers.approved), 
        color: '#10b981' 
      },
      { 
        name: 'Processing', 
        value: Math.round(baseStatusCounts.processing * multipliers.processing), 
        color: '#3b82f6' 
      },
      { 
        name: 'Pending', 
        value: Math.round(baseStatusCounts.pending * multipliers.pending), 
        color: '#f59e0b' 
      },
      { 
        name: 'Paid', 
        value: Math.round(baseStatusCounts.paid * multipliers.paid), 
        color: '#8b5cf6' 
      },
      { 
        name: 'Rejected', 
        value: Math.round(baseStatusCounts.rejected * multipliers.rejected), 
        color: '#ef4444' 
      },
      { 
        name: 'Blocked', 
        value: Math.round(baseStatusCounts.blocked * multipliers.blocked), 
        color: '#ec4899' 
      },
    ].filter((item) => item.value > 0);
  };

  getAmountByStatus = () => {
    const { invoices, selectedPeriod } = this.state;
    const statusAmounts: Record<string, number> = {};

    invoices.forEach((inv) => {
      statusAmounts[inv.status] = (statusAmounts[inv.status] || 0) + inv.amount;
    });

    // Multipliers for different periods
    const periodMultipliers: Record<string, number> = {
      week: 0.7,
      month: 1.0,
      quarter: 1.2,
      year: 1.5,
    };

    const multiplier = periodMultipliers[selectedPeriod] || 1.0;

    return Object.entries(statusAmounts).map(([status, amount]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      amount: Math.round(amount * multiplier),
    }));
  };

  render() {
    const {
      invoices,
      showAddModal,
      showEditModal,
      showViewModal,
      showDeleteModal,
      showNotificationModal,
      editingInvoice,
      viewingInvoice,
      deleteName,
      notificationTitle,
      notificationMessage,
      isMobileMenuOpen,
      selectedPeriod,
    } = this.state;

    const statusData = this.getStatusData();
    const amountData = this.getAmountByStatus();
    
    // Calculate totals based on period
    const periodMultipliers: Record<string, number> = {
      week: 0.7,
      month: 1.0,
      quarter: 1.2,
      year: 1.5,
    };
    const multiplier = periodMultipliers[selectedPeriod] || 1.0;
    
    const baseTotalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalAmount = Math.round(baseTotalAmount * multiplier);
    const totalCount = Math.round(invoices.length * multiplier);

    return (
      <div className={styles.invoices}>
        <header className={styles.invoices__header}>
          <div className={styles.invoices__header_container}>
            <div className={styles.invoices__logo}>BillMate.io</div>
            <nav className={styles.invoices__nav}>
              <Link
                href="/dashboard/analytics"
                className={styles.invoices__nav_link}
              >
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className={`${styles.invoices__nav_link} ${styles['invoices__nav_link--active']}`}
              >
                Invoices
              </Link>
              <Link href="/debtors" className={styles.invoices__nav_link}>
                Debtors
              </Link>
              <Link href="/reports" className={styles.invoices__nav_link}>
                Reports
              </Link>
              <Link href="/settings" className={styles.invoices__nav_link}>
                Settings
              </Link>
            </nav>
            <div className={styles.invoices__user}>
              <span className={styles.invoices__user_icon}>👤</span>
              <Link href="/admin" className={styles.invoices__admin_link}>Admin</Link>
              <button
                onClick={this.handleLogout}
                className={styles.invoices__logout_button}
              >
                Logout
              </button>
            </div>
            <button
              className={styles.invoices__burger}
              onClick={this.handleToggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span
                className={`${styles.invoices__burger_line} ${
                  isMobileMenuOpen
                    ? styles['invoices__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.invoices__burger_line} ${
                  isMobileMenuOpen
                    ? styles['invoices__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.invoices__burger_line} ${
                  isMobileMenuOpen
                    ? styles['invoices__burger_line--open']
                    : ''
                }`}
              ></span>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className={styles.invoices__mobile_menu}>
              <Link
                href="/dashboard/analytics"
                className={styles.invoices__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className={`${styles.invoices__mobile_menu_item} ${styles['invoices__mobile_menu_item--active']}`}
                onClick={this.handleCloseMobileMenu}
              >
                Invoices
              </Link>
              <Link
                href="/debtors"
                className={styles.invoices__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Debtors
              </Link>
              <Link
                href="/reports"
                className={styles.invoices__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Reports
              </Link>
              <Link
                href="/settings"
                className={styles.invoices__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Settings
              </Link>
              <Link
                href="/admin"
                className={styles.invoices__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                👤 Admin
              </Link>
              <button
                onClick={() => {
                  this.handleCloseMobileMenu();
                  this.handleLogout();
                }}
                className={`${styles.invoices__mobile_menu_item} ${styles['invoices__mobile_menu_item--logout']}`}
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main className={styles.invoices__main}>
          <div className={styles.invoices__container}>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Invoices' },
              ]}
            />
            <div className={styles.invoices__header_section}>
              <div>
                <h1 className={styles.invoices__title}>Invoices</h1>
                <p className={styles.invoices__subtitle}>
                  Manage and track all your invoices
                </p>
              </div>
              <button
                onClick={this.handleAddInvoice}
                className={styles.invoices__add_button}
              >
                + Add Invoice
              </button>
            </div>

            <div className={styles.invoices__filters}>
              <div className={styles.invoices__filter_group}>
                <label className={styles.invoices__filter_label}>Period:</label>
                <div className={styles.invoices__filter_buttons}>
                  {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => this.handlePeriodChange(period)}
                      className={`${styles.invoices__filter_button} ${
                        selectedPeriod === period
                          ? styles['invoices__filter_button--active']
                          : ''
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.invoices__summary}>
              <div className={styles.invoices__summary_card}>
                <div className={styles.invoices__summary_label}>Total Invoices</div>
                <div className={styles.invoices__summary_value}>{totalCount}</div>
              </div>
              <div className={styles.invoices__summary_card}>
                <div className={styles.invoices__summary_label}>Total Amount</div>
                <div className={styles.invoices__summary_value}>
                  €{totalAmount.toLocaleString()}
                </div>
              </div>
              <div className={styles.invoices__summary_card}>
                <div className={styles.invoices__summary_label}>Pending</div>
                <div className={styles.invoices__summary_value}>
                  {invoices.filter((inv) => inv.status === 'pending').length}
                </div>
              </div>
              <div className={styles.invoices__summary_card}>
                <div className={styles.invoices__summary_label}>Approved</div>
                <div className={styles.invoices__summary_value}>
                  {invoices.filter((inv) => inv.status === 'approved').length}
                </div>
              </div>
            </div>

            <div className={styles.invoices__charts}>
              <div className={styles.invoices__chart_card}>
                <h2 className={styles.invoices__chart_title}>
                  Invoice Status Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.invoices__chart_card}>
                <h2 className={styles.invoices__chart_title}>
                  Amount by Status
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={amountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip formatter={(value) => `€${(value || 0).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.invoices__table_section}>
              <h2 className={styles.invoices__section_title}>All Invoices</h2>
              <div className={styles.invoices__table_wrapper}>
                <table className={styles.invoices__table}>
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Company</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.invoiceId}</td>
                        <td>{invoice.company}</td>
                        <td>€{invoice.amount.toLocaleString()}</td>
                        <td>{invoice.dueDate}</td>
                        <td>
                          <span
                            className={`${styles.invoices__status} ${styles[`invoices__status--${invoice.status}`]}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.invoices__actions}>
                            <button
                              onClick={() => this.handleViewInvoice(invoice)}
                              className={styles.invoices__action_button}
                            >
                              View
                            </button>
                            <button
                              onClick={() => this.handleEditInvoice(invoice)}
                              className={styles.invoices__action_button}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                this.handleDeleteInvoice(invoice.id, invoice.invoiceId)
                              }
                              className={`${styles.invoices__action_button} ${styles['invoices__action_button--delete']}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {showAddModal && (
          <AddInvoiceModal
            onClose={this.handleCloseAddModal}
            onSave={this.handleSaveInvoice}
          />
        )}

        {showEditModal && editingInvoice && (
          <EditInvoiceModal
            invoice={editingInvoice}
            onClose={this.handleCloseEditModal}
            onSave={this.handleSaveInvoice}
          />
        )}

        {showViewModal && viewingInvoice && (
          <ViewInvoiceModal
            invoice={viewingInvoice}
            onClose={this.handleCloseViewModal}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmModal
            title="Delete Invoice"
            message={`Are you sure you want to delete invoice "${deleteName}"?`}
            onConfirm={this.handleConfirmDelete}
            onCancel={this.handleCloseDeleteModal}
          />
        )}

        {showNotificationModal && (
          <NotificationModal
            title={notificationTitle}
            message={notificationMessage}
            onClose={this.handleCloseNotificationModal}
          />
        )}
      </div>
    );
  }
}

export default Invoices;
