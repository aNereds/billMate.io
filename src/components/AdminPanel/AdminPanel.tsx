'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import styles from './AdminPanel.module.scss';
import {
  mockClients,
  mockAdminInvoices,
  mockPayouts,
  Client,
  Invoice,
  Payout,
} from '@/data/mockData';
import { authService } from '@/utils/auth';
import { storageService, STORAGE_KEYS } from '@/utils/storage';
import { sampleDataService } from '@/utils/auth';
import AddClientModal from './AddClientModal';
import AddPayoutModal from './AddPayoutModal';
import ViewClientModal from './ViewClientModal';
import EditClientModal from './EditClientModal';
import ReviewClientModal from './ReviewClientModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import ViewInvoiceModal from './ViewInvoiceModal';
import ApproveRejectModal from './ApproveRejectModal';
import ViewPayoutModal from './ViewPayoutModal';
import ProcessPayoutModal from './ProcessPayoutModal';

interface AdminPanelState {
  activeTab: 'clients' | 'invoices' | 'payout';
  clients: Client[];
  invoices: Invoice[];
  payouts: Payout[];
  showAddClientModal: boolean;
  showAddPayoutModal: boolean;
  showViewClientModal: boolean;
  showEditClientModal: boolean;
  showReviewClientModal: boolean;
  showDeleteModal: boolean;
  showViewInvoiceModal: boolean;
  showApproveRejectModal: boolean;
  showViewPayoutModal: boolean;
  showProcessPayoutModal: boolean;
  selectedClient: Client | null;
  selectedInvoice: Invoice | null;
  selectedPayout: Payout | null;
  approveRejectType: 'approve' | 'reject' | null;
  deleteType: 'client' | 'invoice' | 'payout' | null;
  deleteId: string | null;
  deleteName: string | null;
  isMobileMenuOpen: boolean;
}

class AdminPanel extends Component<{}, AdminPanelState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeTab: 'clients',
      clients: [],
      invoices: [],
      payouts: [],
      showAddClientModal: false,
      showAddPayoutModal: false,
      showViewClientModal: false,
      showEditClientModal: false,
      showReviewClientModal: false,
      showDeleteModal: false,
      showViewInvoiceModal: false,
      showApproveRejectModal: false,
      showViewPayoutModal: false,
      showProcessPayoutModal: false,
      selectedClient: null,
      selectedInvoice: null,
      selectedPayout: null,
      approveRejectType: null,
      deleteType: null,
      deleteId: null,
      deleteName: null,
      isMobileMenuOpen: false,
    };
  }

  componentDidMount() {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.href = '/onboarding';
      return;
    }

    // Load data
    this.loadData();

    // Close mobile menu on window resize
    window.addEventListener('resize', this.handleResize);

    // Mark sample data
    mockClients.forEach((client) => {
      sampleDataService.markAsSample(client.id, 'client');
    });
    mockAdminInvoices.forEach((inv) => {
      sampleDataService.markAsSample(inv.id, 'invoice');
    });
    mockPayouts.forEach((payout) => {
      sampleDataService.markAsSample(payout.id, 'payout');
    });
  }

  loadData = () => {
    const storedClients = storageService.getItems<Client>(STORAGE_KEYS.CLIENTS);
    const allClients = [...mockClients, ...storedClients];

    const storedInvoices = storageService.getItems<Invoice>(
      STORAGE_KEYS.INVOICES
    );
    const allInvoices = [...mockAdminInvoices, ...storedInvoices];

    const storedPayouts = storageService.getItems<Payout>(
      STORAGE_KEYS.PAYOUTS
    );
    const allPayouts = [...mockPayouts, ...storedPayouts];

    this.setState({
      clients: allClients,
      invoices: allInvoices,
      payouts: allPayouts,
    });
  };

  handleTabChange = (tab: AdminPanelState['activeTab']) => {
    this.setState({ activeTab: tab, isMobileMenuOpen: false });
  };

  handleToggleMobileMenu = () => {
    this.setState((prevState) => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }));
  };

  handleCloseMobileMenu = () => {
    this.setState({ isMobileMenuOpen: false });
  };

  handleResize = () => {
    if (window.innerWidth > 1024) {
      this.setState({ isMobileMenuOpen: false });
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleViewInvoice = (invoiceId: string) => {
    const invoice = this.state.invoices.find((inv) => inv.invoiceId === invoiceId);
    if (invoice) {
      this.setState({
        showViewInvoiceModal: true,
        selectedInvoice: invoice,
      });
    }
  };

  handleApproveInvoiceClick = (invoiceId: string) => {
    const invoice = this.state.invoices.find((inv) => inv.invoiceId === invoiceId);
    if (invoice) {
      this.setState({
        showApproveRejectModal: true,
        selectedInvoice: invoice,
        approveRejectType: 'approve',
      });
    }
  };

  handleRejectInvoiceClick = (invoiceId: string) => {
    const invoice = this.state.invoices.find((inv) => inv.invoiceId === invoiceId);
    if (invoice) {
      this.setState({
        showApproveRejectModal: true,
        selectedInvoice: invoice,
        approveRejectType: 'reject',
      });
    }
  };

  handleApproveInvoice = () => {
    if (this.state.selectedInvoice) {
      const { invoices } = this.state;
      const storedInvoices = storageService.getItems<Invoice>(STORAGE_KEYS.INVOICES);
      const isStored = storedInvoices.some((inv) => inv.id === this.state.selectedInvoice!.id);
      
      if (isStored) {
        storageService.updateItem<Invoice>(STORAGE_KEYS.INVOICES, this.state.selectedInvoice.id, {
          status: 'approved',
        });
      } else {
        // For mock invoices, update state
        const updatedInvoices = invoices.map((inv) =>
          inv.id === this.state.selectedInvoice!.id
            ? { ...inv, status: 'approved' as const }
            : inv
        );
        this.setState({ invoices: updatedInvoices });
      }
      this.loadData();
      this.handleCloseApproveRejectModal();
    }
  };

  handleRejectInvoice = () => {
    if (this.state.selectedInvoice) {
      const { invoices } = this.state;
      const storedInvoices = storageService.getItems<Invoice>(STORAGE_KEYS.INVOICES);
      const isStored = storedInvoices.some((inv) => inv.id === this.state.selectedInvoice!.id);
      
      if (isStored) {
        storageService.updateItem<Invoice>(STORAGE_KEYS.INVOICES, this.state.selectedInvoice.id, {
          status: 'rejected',
        });
      } else {
        // For mock invoices, update state
        const updatedInvoices = invoices.map((inv) =>
          inv.id === this.state.selectedInvoice!.id
            ? { ...inv, status: 'rejected' as const }
            : inv
        );
        this.setState({ invoices: updatedInvoices });
      }
      this.loadData();
      this.handleCloseApproveRejectModal();
    }
  };

  handleCloseViewInvoiceModal = () => {
    this.setState({
      showViewInvoiceModal: false,
      selectedInvoice: null,
    });
  };

  handleCloseApproveRejectModal = () => {
    this.setState({
      showApproveRejectModal: false,
      selectedInvoice: null,
      approveRejectType: null,
    });
  };

  handleViewPayout = (payoutId: string) => {
    const payout = this.state.payouts.find((p) => p.payoutId === payoutId);
    if (payout) {
      this.setState({
        showViewPayoutModal: true,
        selectedPayout: payout,
      });
    }
  };

  handleProcessPayoutClick = (payoutId: string) => {
    const payout = this.state.payouts.find((p) => p.payoutId === payoutId);
    if (payout) {
      this.setState({
        showProcessPayoutModal: true,
        selectedPayout: payout,
      });
    }
  };

  handleProcessPayout = () => {
    if (this.state.selectedPayout) {
      const { payouts } = this.state;
      const storedPayouts = storageService.getItems<Payout>(STORAGE_KEYS.PAYOUTS);
      const isStored = storedPayouts.some((p) => p.id === this.state.selectedPayout!.id);
      
      if (isStored) {
        storageService.updateItem<Payout>(STORAGE_KEYS.PAYOUTS, this.state.selectedPayout.id, {
          status: 'processing',
        });
      } else {
        // For mock payouts, update state
        const updatedPayouts = payouts.map((p) =>
          p.id === this.state.selectedPayout!.id
            ? { ...p, status: 'processing' as const }
            : p
        );
        this.setState({ payouts: updatedPayouts });
      }
      this.loadData();
      this.handleCloseProcessPayoutModal();
    }
  };

  handleCloseViewPayoutModal = () => {
    this.setState({
      showViewPayoutModal: false,
      selectedPayout: null,
    });
  };

  handleCloseProcessPayoutModal = () => {
    this.setState({
      showProcessPayoutModal: false,
      selectedPayout: null,
    });
  };

  handleViewClient = (clientId: string) => {
    const client = this.state.clients.find((c) => c.id === clientId);
    if (client) {
      this.setState({
        showViewClientModal: true,
        selectedClient: client,
      });
    }
  };

  handleEditClient = (clientId: string) => {
    const client = this.state.clients.find((c) => c.id === clientId);
    if (client) {
      this.setState({
        showEditClientModal: true,
        selectedClient: client,
      });
    }
  };

  handleReviewClient = (clientId: string) => {
    const client = this.state.clients.find((c) => c.id === clientId);
    if (client) {
      this.setState({
        showReviewClientModal: true,
        selectedClient: client,
      });
    }
  };

  handleApproveClient = (clientId: string) => {
    const { clients } = this.state;
    const client = clients.find((c) => c.id === clientId);
    
    if (client) {
      // Check if it's a mock client (not in localStorage)
      const storedClients = storageService.getItems<Client>(STORAGE_KEYS.CLIENTS);
      const isStored = storedClients.some((c) => c.id === clientId);
      
      if (isStored) {
        storageService.updateItem<Client>(STORAGE_KEYS.CLIENTS, clientId, {
          status: 'active',
        });
      } else {
        // For mock clients, we can't update them, but we can add a new entry
        // or just update the state for demo purposes
        const updatedClients = clients.map((c) =>
          c.id === clientId ? { ...c, status: 'active' as const } : c
        );
        this.setState({ clients: updatedClients });
      }
      this.loadData();
      this.handleCloseReviewModal();
    }
  };

  handleRejectClient = (clientId: string) => {
    const { clients } = this.state;
    const client = clients.find((c) => c.id === clientId);
    
    if (client) {
      // Check if it's a mock client (not in localStorage)
      const storedClients = storageService.getItems<Client>(STORAGE_KEYS.CLIENTS);
      const isStored = storedClients.some((c) => c.id === clientId);
      
      if (isStored) {
        storageService.updateItem<Client>(STORAGE_KEYS.CLIENTS, clientId, {
          status: 'suspended',
        });
      } else {
        // For mock clients, update state for demo purposes
        const updatedClients = clients.map((c) =>
          c.id === clientId ? { ...c, status: 'suspended' as const } : c
        );
        this.setState({ clients: updatedClients });
      }
      this.loadData();
      this.handleCloseReviewModal();
    }
  };

  handleCloseViewModal = () => {
    this.setState({
      showViewClientModal: false,
      selectedClient: null,
    });
  };

  handleCloseEditModal = () => {
    this.setState({
      showEditClientModal: false,
      selectedClient: null,
    });
  };

  handleCloseReviewModal = () => {
    this.setState({
      showReviewClientModal: false,
      selectedClient: null,
    });
  };

  handleSaveClientEdit = (clientData: Omit<Client, 'id'>) => {
    if (this.state.selectedClient) {
      const { clients } = this.state;
      const storedClients = storageService.getItems<Client>(STORAGE_KEYS.CLIENTS);
      const isStored = storedClients.some((c) => c.id === this.state.selectedClient!.id);
      
      if (isStored) {
        storageService.updateItem<Client>(
          STORAGE_KEYS.CLIENTS,
          this.state.selectedClient.id,
          clientData
        );
      } else {
        // For mock clients, update state for demo purposes
        const updatedClients = clients.map((c) =>
          c.id === this.state.selectedClient!.id
            ? { ...clientData, id: this.state.selectedClient!.id }
            : c
        );
        this.setState({ clients: updatedClients });
      }
      this.loadData();
      this.handleCloseEditModal();
    }
  };

  handleDeleteClick = (type: 'client' | 'invoice' | 'payout', id: string, name: string) => {
    this.setState({
      showDeleteModal: true,
      deleteType: type,
      deleteId: id,
      deleteName: name,
    });
  };

  handleDeleteConfirm = () => {
    const { deleteType, deleteId } = this.state;
    if (!deleteType || !deleteId) return;

    if (deleteType === 'client') {
      this.handleRemoveClient(deleteId);
    } else if (deleteType === 'invoice') {
      this.handleRemoveInvoice(deleteId);
    } else if (deleteType === 'payout') {
      this.handleRemovePayout(deleteId);
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

  handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  handleRemoveClient = (id: string) => {
    if (sampleDataService.isSample(id, 'client')) {
      alert('Cannot delete sample data');
      return;
    }

    storageService.removeItem<Client>(STORAGE_KEYS.CLIENTS, id);
    this.loadData();
  };

  handleRemoveInvoice = (id: string) => {
    if (sampleDataService.isSample(id, 'invoice')) {
      alert('Cannot delete sample data');
      return;
    }

    storageService.removeItem<Invoice>(STORAGE_KEYS.INVOICES, id);
    this.loadData();
  };

  handleRemovePayout = (id: string) => {
    if (sampleDataService.isSample(id, 'payout')) {
      alert('Cannot delete sample data');
      return;
    }

    storageService.removeItem<Payout>(STORAGE_KEYS.PAYOUTS, id);
    this.loadData();
  };

  handleAddClient = () => {
    this.setState({ showAddClientModal: true });
  };

  handleSaveClient = (clientData: {
    name: string;
    email: string;
    country: string;
    creditLimit: number;
  }) => {
    const newClient: Client = {
      id: `CLI-${Date.now()}`,
      name: clientData.name,
      email: clientData.email,
      country: clientData.country,
      creditLimit: clientData.creditLimit,
      status: 'pending',
    };

    storageService.addItem(STORAGE_KEYS.CLIENTS, newClient);
    this.loadData();
  };

  handleCloseClientModal = () => {
    this.setState({ showAddClientModal: false });
  };

  handleAddPayout = () => {
    this.setState({ showAddPayoutModal: true });
  };

  handleSavePayout = (payoutData: {
    client: string;
    invoiceId: string;
    amount: number;
    date: string;
  }) => {
    const newPayout: Payout = {
      id: `PAY-${Date.now()}`,
      payoutId: `PAY-${500 + Math.floor(Math.random() * 1000)}`,
      client: payoutData.client,
      invoiceId: payoutData.invoiceId,
      amount: payoutData.amount,
      date: payoutData.date,
      status: 'pending',
    };

    storageService.addItem(STORAGE_KEYS.PAYOUTS, newPayout);
    this.loadData();
  };

  handleClosePayoutModal = () => {
    this.setState({ showAddPayoutModal: false });
  };

  render() {
    const {
      activeTab,
      clients,
      invoices,
      payouts,
      showAddClientModal,
      showAddPayoutModal,
      showViewClientModal,
      showEditClientModal,
      showReviewClientModal,
      showDeleteModal,
      showViewInvoiceModal,
      showApproveRejectModal,
      showViewPayoutModal,
      showProcessPayoutModal,
      selectedClient,
      selectedInvoice,
      selectedPayout,
      approveRejectType,
      deleteType,
      deleteId,
      deleteName,
    } = this.state;

    return (
      <div className={styles.admin}>
        <header className={styles.admin__header}>
          <div className={styles.admin__header_container}>
            <div className={styles.admin__header_title}>Admin Panel</div>
            <nav className={styles.admin__nav}>
              <button
                className={`${styles.admin__nav_link} ${
                  activeTab === 'clients'
                    ? styles['admin__nav_link--active']
                    : ''
                }`}
                onClick={() => this.handleTabChange('clients')}
              >
                Clients
              </button>
              <button
                className={`${styles.admin__nav_link} ${
                  activeTab === 'invoices'
                    ? styles['admin__nav_link--active']
                    : ''
                }`}
                onClick={() => this.handleTabChange('invoices')}
              >
                Invoices
              </button>
              <button
                className={`${styles.admin__nav_link} ${
                  activeTab === 'payout'
                    ? styles['admin__nav_link--active']
                    : ''
                }`}
                onClick={() => this.handleTabChange('payout')}
              >
                $ Payout
              </button>
            </nav>
            <div className={styles.admin__header_actions}>
              <Link href="/dashboard" className={styles.admin__exit}>
                Exit Admin →
              </Link>
              <button
                onClick={this.handleLogout}
                className={styles.admin__logout_button}
              >
                Logout
              </button>
            </div>
            <button
              className={styles.admin__burger}
              onClick={this.handleToggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span
                className={`${styles.admin__burger_line} ${
                  this.state.isMobileMenuOpen
                    ? styles['admin__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.admin__burger_line} ${
                  this.state.isMobileMenuOpen
                    ? styles['admin__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.admin__burger_line} ${
                  this.state.isMobileMenuOpen
                    ? styles['admin__burger_line--open']
                    : ''
                }`}
              ></span>
            </button>
          </div>
          {this.state.isMobileMenuOpen && (
            <div className={styles.admin__mobile_menu}>
              <button
                className={`${styles.admin__mobile_menu_item} ${
                  activeTab === 'clients'
                    ? styles['admin__mobile_menu_item--active']
                    : ''
                }`}
                onClick={() => this.handleTabChange('clients')}
              >
                Clients
              </button>
              <button
                className={`${styles.admin__mobile_menu_item} ${
                  activeTab === 'invoices'
                    ? styles['admin__mobile_menu_item--active']
                    : ''
                }`}
                onClick={() => this.handleTabChange('invoices')}
              >
                Invoices
              </button>
              <button
                className={`${styles.admin__mobile_menu_item} ${
                  activeTab === 'payout'
                    ? styles['admin__mobile_menu_item--active']
                    : ''
                }`}
                onClick={() => this.handleTabChange('payout')}
              >
                $ Payout
              </button>
              <Link
                href="/dashboard"
                className={styles.admin__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Exit Admin →
              </Link>
              <button
                onClick={() => {
                  this.handleCloseMobileMenu();
                  this.handleLogout();
                }}
                className={`${styles.admin__mobile_menu_item} ${styles['admin__mobile_menu_item--logout']}`}
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main className={styles.admin__main}>
          <div className={styles.admin__container}>
            <div className={styles.admin__section}>
              {activeTab === 'clients' && (
                <>
                  <div className={styles.admin__section_header}>
                    <div>
                      <h1 className={styles.admin__title}>
                        Clients Management
                      </h1>
                      <p className={styles.admin__subtitle}>
                        View and manage all registered clients
                      </p>
                    </div>
                    <button
                      className={styles.admin__create_button}
                      onClick={this.handleAddClient}
                    >
                      <span>+</span> Add Client
                    </button>
                  </div>
                  <div className={styles.admin__table_wrapper}>
                    <table className={styles.admin__table}>
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Email</th>
                          <th>Country</th>
                          <th>Credit Limit</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>{client.country}</td>
                            <td>€{client.creditLimit.toLocaleString()}</td>
                            <td>
                              <span
                                className={`${styles.admin__status} ${styles[`admin__status--${client.status}`]}`}
                              >
                                {client.status}
                              </span>
                            </td>
                            <td>
                              {client.status === 'pending' ? (
                                <button
                                  className={styles.admin__review_button}
                                  onClick={() =>
                                    this.handleReviewClient(client.id)
                                  }
                                >
                                  Review
                                </button>
                              ) : (
                                <div className={styles.admin__actions}>
                                  <button
                                    className={styles.admin__action_icon}
                                    title="View"
                                    onClick={() => this.handleViewClient(client.id)}
                                  >
                                    👁️
                                  </button>
                                  <button
                                    className={styles.admin__action_icon}
                                    title="Edit"
                                    onClick={() => this.handleEditClient(client.id)}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className={styles.admin__action_icon}
                                    title="Delete"
                                    onClick={() =>
                                      this.handleDeleteClick('client', client.id, client.name)
                                    }
                                  >
                                    🚫
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'invoices' && (
                <>
                  <div className={styles.admin__section_header}>
                    <div>
                      <h1 className={styles.admin__title}>
                        Invoice Management
                      </h1>
                      <p className={styles.admin__subtitle}>
                        View and manage all invoices in the system
                      </p>
                    </div>
                  </div>
                  <div className={styles.admin__table_wrapper}>
                    <table className={styles.admin__table}>
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Client</th>
                          <th>Amount</th>
                          <th>Date</th>
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
                            <td>{invoice.date}</td>
                            <td>{invoice.dueDate}</td>
                            <td>
                              <span
                                className={`${styles.admin__status} ${
                                  invoice.status === 'pending'
                                    ? styles['admin__status--pending_approval']
                                    : styles[`admin__status--${invoice.status}`]
                                }`}
                              >
                                {invoice.status === 'pending'
                                  ? 'pending approval'
                                  : invoice.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.admin__actions}>
                                <button
                                  className={styles.admin__action_icon}
                                  title="View"
                                  onClick={() => this.handleViewInvoice(invoice.invoiceId)}
                                >
                                  👁️
                                </button>
                                {invoice.status === 'pending' && (
                                  <>
                                    <button
                                      className={`${styles.admin__action_icon} ${styles['admin__action_icon--success']}`}
                                      onClick={() =>
                                        this.handleApproveInvoiceClick(
                                          invoice.invoiceId
                                        )
                                      }
                                      title="Approve"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      className={`${styles.admin__action_icon} ${styles['admin__action_icon--error']}`}
                                      onClick={() =>
                                        this.handleRejectInvoiceClick(
                                          invoice.invoiceId
                                        )
                                      }
                                      title="Reject"
                                    >
                                      ✕
                                    </button>
                                  </>
                                )}
                                {!sampleDataService.isSample(invoice.id, 'invoice') && (
                                  <button
                                    className={`${styles.admin__action_icon} ${styles['admin__action_icon--error']}`}
                                    onClick={() =>
                                      this.handleDeleteClick('invoice', invoice.id, invoice.invoiceId)
                                    }
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'payout' && (
                <>
                  <div className={styles.admin__section_header}>
                    <div>
                      <h1 className={styles.admin__title}>
                        Payout Management
                      </h1>
                      <p className={styles.admin__subtitle}>
                        View and process client payouts
                      </p>
                    </div>
                    <button
                      className={styles.admin__create_button}
                      onClick={this.handleAddPayout}
                    >
                      <span>+</span> Create Payout
                    </button>
                  </div>
                  <div className={styles.admin__table_wrapper}>
                    <table className={styles.admin__table}>
                      <thead>
                        <tr>
                          <th>Payout #</th>
                          <th>Client</th>
                          <th>Invoice #</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payouts.map((payout) => (
                          <tr key={payout.id}>
                            <td>{payout.payoutId}</td>
                            <td>{payout.client}</td>
                            <td>{payout.invoiceId}</td>
                            <td>€{payout.amount.toLocaleString()}</td>
                            <td>{payout.date}</td>
                            <td>
                              <span
                                className={`${styles.admin__status} ${styles[`admin__status--${payout.status}`]}`}
                              >
                                {payout.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.admin__actions}>
                                <button
                                  className={styles.admin__action_icon}
                                  title="View"
                                  onClick={() => this.handleViewPayout(payout.payoutId)}
                                >
                                  👁️
                                </button>
                                {payout.status === 'pending' && (
                                  <button
                                    className={styles.admin__action_icon}
                                    onClick={() =>
                                      this.handleProcessPayoutClick(
                                        payout.payoutId
                                      )
                                    }
                                    title="Process"
                                  >
                                    $
                                  </button>
                                )}
                                {!sampleDataService.isSample(payout.id, 'payout') && (
                                  <button
                                    className={`${styles.admin__action_icon} ${styles['admin__action_icon--error']}`}
                                    onClick={() =>
                                      this.handleDeleteClick('payout', payout.id, payout.payoutId)
                                    }
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        <AddClientModal
          isOpen={showAddClientModal}
          onClose={this.handleCloseClientModal}
          onSave={this.handleSaveClient}
        />

        <AddPayoutModal
          isOpen={showAddPayoutModal}
          onClose={this.handleClosePayoutModal}
          onSave={this.handleSavePayout}
        />

        <ViewClientModal
          isOpen={showViewClientModal}
          onClose={this.handleCloseViewModal}
          client={selectedClient}
        />

        <EditClientModal
          isOpen={showEditClientModal}
          onClose={this.handleCloseEditModal}
          onSave={this.handleSaveClientEdit}
          client={selectedClient}
        />

        <ReviewClientModal
          isOpen={showReviewClientModal}
          onClose={this.handleCloseReviewModal}
          onApprove={this.handleApproveClient}
          onReject={this.handleRejectClient}
          client={selectedClient}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={this.handleCloseDeleteModal}
          onConfirm={this.handleDeleteConfirm}
          title="Confirm Delete"
          message={
            deleteType === 'client'
              ? 'Are you sure you want to delete this client?'
              : deleteType === 'invoice'
              ? 'Are you sure you want to delete this invoice?'
              : 'Are you sure you want to delete this payout?'
          }
          itemName={deleteName || undefined}
        />

        <ViewInvoiceModal
          isOpen={showViewInvoiceModal}
          onClose={this.handleCloseViewInvoiceModal}
          invoice={selectedInvoice}
        />

        <ApproveRejectModal
          isOpen={showApproveRejectModal}
          onClose={this.handleCloseApproveRejectModal}
          onApprove={this.handleApproveInvoice}
          onReject={this.handleRejectInvoice}
          invoice={selectedInvoice}
          type={approveRejectType || 'approve'}
        />

        <ViewPayoutModal
          isOpen={showViewPayoutModal}
          onClose={this.handleCloseViewPayoutModal}
          payout={selectedPayout}
        />

        <ProcessPayoutModal
          isOpen={showProcessPayoutModal}
          onClose={this.handleCloseProcessPayoutModal}
          onConfirm={this.handleProcessPayout}
          payout={selectedPayout}
        />
      </div>
    );
  }
}

export default AdminPanel;
