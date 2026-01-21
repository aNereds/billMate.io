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
import styles from './Debtors.module.scss';
import { authService } from '@/utils/auth';
import { storageService, STORAGE_KEYS } from '@/utils/storage';
import { sampleDataService } from '@/utils/auth';
import { mockDebtors, Debtor } from '@/data/mockData';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import AddDebtorModal from './AddDebtorModal';
import EditDebtorModal from './EditDebtorModal';
import ViewDebtorModal from './ViewDebtorModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import NotificationModal from './NotificationModal';

interface DebtorsState {
  debtors: Debtor[];
  showAddModal: boolean;
  showEditModal: boolean;
  showViewModal: boolean;
  showDeleteModal: boolean;
  showNotificationModal: boolean;
  editingDebtor: Debtor | null;
  viewingDebtor: Debtor | null;
  deleteId: string | null;
  deleteName: string | null;
  notificationTitle: string;
  notificationMessage: string;
  isMobileMenuOpen: boolean;
  selectedPeriod: 'week' | 'month' | 'quarter' | 'year';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

class Debtors extends Component<{}, DebtorsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      debtors: [],
      showAddModal: false,
      showEditModal: false,
      showViewModal: false,
      showDeleteModal: false,
      showNotificationModal: false,
      editingDebtor: null,
      viewingDebtor: null,
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

    mockDebtors.forEach((deb) => {
      sampleDataService.markAsSample(deb.id, 'debtor');
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
    const storedDebtors = storageService.getItems<Debtor>(STORAGE_KEYS.DEBTORS);
    this.setState({
      debtors: storedDebtors.length > 0 ? storedDebtors : mockDebtors,
    });
  };

  handleAddDebtor = () => {
    this.setState({ showAddModal: true });
  };

  handleEditDebtor = (debtor: Debtor) => {
    this.setState({
      editingDebtor: debtor,
      showEditModal: true,
    });
  };

  handleViewDebtor = (debtor: Debtor) => {
    this.setState({
      viewingDebtor: debtor,
      showViewModal: true,
    });
  };

  handleDeleteDebtor = (id: string, name: string) => {
    if (sampleDataService.isSample(id, 'debtor')) {
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

    const updatedDebtors = this.state.debtors.filter((deb) => deb.id !== deleteId);
    this.setState({ debtors: updatedDebtors });
    storageService.saveItems(STORAGE_KEYS.DEBTORS, updatedDebtors);
    this.handleCloseDeleteModal();
  };

  handleCloseAddModal = () => {
    this.setState({ showAddModal: false });
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, editingDebtor: null });
  };

  handleCloseViewModal = () => {
    this.setState({ showViewModal: false, viewingDebtor: null });
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

  handleSaveDebtor = (debtorData: Partial<Debtor>) => {
    const { editingDebtor } = this.state;
    let updatedDebtors: Debtor[];

    if (editingDebtor) {
      updatedDebtors = this.state.debtors.map((deb) =>
        deb.id === editingDebtor.id
          ? { ...deb, ...debtorData }
          : deb
      );
    } else {
      const newDebtor: Debtor = {
        id: `DEB-${Date.now()}`,
        companyName: debtorData.companyName || '',
        country: debtorData.country || 'Latvia',
        registrationNumber: debtorData.registrationNumber || '',
        creditLimit: debtorData.creditLimit || 0,
      };
      updatedDebtors = [...this.state.debtors, newDebtor];
    }

    this.setState({ debtors: updatedDebtors });
    storageService.saveItems(STORAGE_KEYS.DEBTORS, updatedDebtors);
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

  getCountryData = () => {
    const { debtors, selectedPeriod } = this.state;
    const countryCounts: Record<string, number> = {};

    debtors.forEach((deb) => {
      countryCounts[deb.country] = (countryCounts[deb.country] || 0) + 1;
    });

    const periodMultipliers: Record<string, number> = {
      week: 0.6,
      month: 1.0,
      quarter: 1.3,
      year: 1.6,
    };

    const multiplier = periodMultipliers[selectedPeriod] || 1.0;

    return Object.entries(countryCounts).map(([country, count], index) => ({
      name: country,
      value: Math.round(count * multiplier),
      color: COLORS[index % COLORS.length],
    }));
  };

  getCreditLimitData = () => {
    const { debtors, selectedPeriod } = this.state;
    
    const periodMultipliers: Record<string, number> = {
      week: 0.8,
      month: 1.0,
      quarter: 1.15,
      year: 1.3,
    };

    const multiplier = periodMultipliers[selectedPeriod] || 1.0;

    return debtors.map((deb) => ({
      name: deb.companyName.length > 15 ? deb.companyName.substring(0, 15) + '...' : deb.companyName,
      limit: Math.round(deb.creditLimit * multiplier),
    }));
  };

  render() {
    const {
      debtors,
      showAddModal,
      showEditModal,
      showViewModal,
      showDeleteModal,
      showNotificationModal,
      editingDebtor,
      viewingDebtor,
      deleteName,
      notificationTitle,
      notificationMessage,
      isMobileMenuOpen,
      selectedPeriod,
    } = this.state;

    const countryData = this.getCountryData();
    const creditLimitData = this.getCreditLimitData();
    
    const periodMultipliers: Record<string, number> = {
      week: 0.8,
      month: 1.0,
      quarter: 1.15,
      year: 1.3,
    };
    const multiplier = periodMultipliers[selectedPeriod] || 1.0;
    
    const baseTotalCreditLimit = debtors.reduce((sum, deb) => sum + deb.creditLimit, 0);
    const totalCreditLimit = Math.round(baseTotalCreditLimit * multiplier);
    const totalCount = Math.round(debtors.length * multiplier);

    return (
      <div className={styles.debtors}>
        <header className={styles.debtors__header}>
          <div className={styles.debtors__header_container}>
            <div className={styles.debtors__logo}>BillApp.io</div>
            <nav className={styles.debtors__nav}>
              <Link
                href="/dashboard/analytics"
                className={styles.debtors__nav_link}
              >
                Dashboard
              </Link>
              <Link href="/invoices" className={styles.debtors__nav_link}>
                Invoices
              </Link>
              <Link
                href="/debtors"
                className={`${styles.debtors__nav_link} ${styles['debtors__nav_link--active']}`}
              >
                Debtors
              </Link>
              <Link href="/reports" className={styles.debtors__nav_link}>
                Reports
              </Link>
              <Link href="/settings" className={styles.debtors__nav_link}>
                Settings
              </Link>
            </nav>
            <div className={styles.debtors__user}>
              <span className={styles.debtors__user_icon}>👤</span>
              <Link href="/admin" className={styles.debtors__admin_link}>Admin</Link>
              <button
                onClick={this.handleLogout}
                className={styles.debtors__logout_button}
              >
                Logout
              </button>
            </div>
            <button
              className={styles.debtors__burger}
              onClick={this.handleToggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span
                className={`${styles.debtors__burger_line} ${
                  isMobileMenuOpen
                    ? styles['debtors__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.debtors__burger_line} ${
                  isMobileMenuOpen
                    ? styles['debtors__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.debtors__burger_line} ${
                  isMobileMenuOpen
                    ? styles['debtors__burger_line--open']
                    : ''
                }`}
              ></span>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className={styles.debtors__mobile_menu}>
              <Link
                href="/dashboard/analytics"
                className={styles.debtors__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className={styles.debtors__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Invoices
              </Link>
              <Link
                href="/debtors"
                className={`${styles.debtors__mobile_menu_item} ${styles['debtors__mobile_menu_item--active']}`}
                onClick={this.handleCloseMobileMenu}
              >
                Debtors
              </Link>
              <Link
                href="/reports"
                className={styles.debtors__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Reports
              </Link>
              <Link
                href="/settings"
                className={styles.debtors__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Settings
              </Link>
              <Link
                href="/admin"
                className={styles.debtors__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                👤 Admin
              </Link>
              <button
                onClick={() => {
                  this.handleCloseMobileMenu();
                  this.handleLogout();
                }}
                className={`${styles.debtors__mobile_menu_item} ${styles['debtors__mobile_menu_item--logout']}`}
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main className={styles.debtors__main}>
          <div className={styles.debtors__container}>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Debtors' },
              ]}
            />
            <div className={styles.debtors__header_section}>
              <div>
                <h1 className={styles.debtors__title}>Debtors</h1>
                <p className={styles.debtors__subtitle}>
                  Manage and track all your debtors
                </p>
              </div>
              <button
                onClick={this.handleAddDebtor}
                className={styles.debtors__add_button}
              >
                + Add Debtor
              </button>
            </div>

            <div className={styles.debtors__filters}>
              <div className={styles.debtors__filter_group}>
                <label className={styles.debtors__filter_label}>Period:</label>
                <div className={styles.debtors__filter_buttons}>
                  {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => this.handlePeriodChange(period)}
                      className={`${styles.debtors__filter_button} ${
                        selectedPeriod === period
                          ? styles['debtors__filter_button--active']
                          : ''
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.debtors__summary}>
              <div className={styles.debtors__summary_card}>
                <div className={styles.debtors__summary_label}>Total Debtors</div>
                <div className={styles.debtors__summary_value}>{totalCount}</div>
              </div>
              <div className={styles.debtors__summary_card}>
                <div className={styles.debtors__summary_label}>Total Credit Limit</div>
                <div className={styles.debtors__summary_value}>
                  €{totalCreditLimit.toLocaleString()}
                </div>
              </div>
              <div className={styles.debtors__summary_card}>
                <div className={styles.debtors__summary_label}>Average Limit</div>
                <div className={styles.debtors__summary_value}>
                  €{totalCount > 0 ? Math.round(totalCreditLimit / totalCount).toLocaleString() : 0}
                </div>
              </div>
              <div className={styles.debtors__summary_card}>
                <div className={styles.debtors__summary_label}>Countries</div>
                <div className={styles.debtors__summary_value}>
                  {new Set(debtors.map((deb) => deb.country)).size}
                </div>
              </div>
            </div>

            <div className={styles.debtors__charts}>
              <div className={styles.debtors__chart_card}>
                <h2 className={styles.debtors__chart_title}>
                  Debtors by Country
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={countryData}
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
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.debtors__chart_card}>
                <h2 className={styles.debtors__chart_title}>
                  Credit Limits by Debtor
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={creditLimitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => `€${(value || 0).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="limit" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.debtors__table_section}>
              <h2 className={styles.debtors__section_title}>All Debtors</h2>
              <div className={styles.debtors__table_wrapper}>
                <table className={styles.debtors__table}>
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>Country</th>
                      <th>Registration Number</th>
                      <th>Credit Limit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtors.map((debtor) => (
                      <tr key={debtor.id}>
                        <td>{debtor.companyName}</td>
                        <td>{debtor.country}</td>
                        <td>{debtor.registrationNumber}</td>
                        <td>€{debtor.creditLimit.toLocaleString()}</td>
                        <td>
                          <div className={styles.debtors__actions}>
                            <button
                              onClick={() => this.handleViewDebtor(debtor)}
                              className={styles.debtors__action_button}
                            >
                              View
                            </button>
                            <button
                              onClick={() => this.handleEditDebtor(debtor)}
                              className={styles.debtors__action_button}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                this.handleDeleteDebtor(debtor.id, debtor.companyName)
                              }
                              className={`${styles.debtors__action_button} ${styles['debtors__action_button--delete']}`}
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
          <AddDebtorModal
            onClose={this.handleCloseAddModal}
            onSave={this.handleSaveDebtor}
          />
        )}

        {showEditModal && editingDebtor && (
          <EditDebtorModal
            debtor={editingDebtor}
            onClose={this.handleCloseEditModal}
            onSave={this.handleSaveDebtor}
          />
        )}

        {showViewModal && viewingDebtor && (
          <ViewDebtorModal
            debtor={viewingDebtor}
            onClose={this.handleCloseViewModal}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmModal
            title="Delete Debtor"
            message={`Are you sure you want to delete debtor "${deleteName}"?`}
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

export default Debtors;
