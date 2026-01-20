'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import styles from './Settings.module.scss';
import { authService } from '@/utils/auth';
import { storageService, STORAGE_KEYS } from '@/utils/storage';
import NotificationModal from './NotificationModal';
import IntegrationModal from './IntegrationModal';

interface Notification {
  id: string;
  type: string;
  enabled: boolean;
  email: boolean;
  sms: boolean;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  apiKey?: string;
}

interface SettingsState {
  notifications: Notification[];
  integrations: Integration[];
  showNotificationModal: boolean;
  showIntegrationModal: boolean;
  editingNotification: Notification | null;
  editingIntegration: Integration | null;
  securitySettings: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'Invoice Status Change',
    enabled: true,
    email: true,
    sms: false,
  },
  {
    id: '2',
    type: 'Payment Received',
    enabled: true,
    email: true,
    sms: true,
  },
  {
    id: '3',
    type: 'Debtor Alert',
    enabled: true,
    email: true,
    sms: false,
  },
  {
    id: '4',
    type: 'System Updates',
    enabled: false,
    email: false,
    sms: false,
  },
];

const DEFAULT_INTEGRATIONS: Integration[] = [
  {
    id: '1',
    name: 'Accounting System',
    type: 'API',
    status: 'active',
    apiKey: '***hidden***',
  },
  {
    id: '2',
    name: 'Email Service',
    type: 'SMTP',
    status: 'active',
  },
  {
    id: '3',
    name: 'Payment Gateway',
    type: 'API',
    status: 'inactive',
  },
];

class Settings extends Component<{}, SettingsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      notifications: [],
      integrations: [],
      showNotificationModal: false,
      showIntegrationModal: false,
      editingNotification: null,
      editingIntegration: null,
      securitySettings: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
      },
    };
  }

  componentDidMount() {
    if (!authService.isAuthenticated()) {
      window.location.href = '/onboarding';
      return;
    }

    this.loadData();
  }

  loadData = () => {
    const storedNotifications = storageService.getItems<Notification>(
      'billmate_notifications'
    );
    const storedIntegrations = storageService.getItems<Integration>(
      'billmate_integrations'
    );
    const storedSecurity = storageService.getItems<SettingsState['securitySettings']>(
      'billmate_security'
    );

    this.setState({
      notifications:
        storedNotifications.length > 0
          ? storedNotifications
          : DEFAULT_NOTIFICATIONS,
      integrations:
        storedIntegrations.length > 0
          ? storedIntegrations
          : DEFAULT_INTEGRATIONS,
      securitySettings:
        storedSecurity.length > 0
          ? storedSecurity[0]
          : this.state.securitySettings,
    });
  };

  handleAddNotification = () => {
    this.setState({
      showNotificationModal: true,
      editingNotification: null,
    });
  };

  handleEditNotification = (notification: Notification) => {
    this.setState({
      showNotificationModal: true,
      editingNotification: notification,
    });
  };

  handleSaveNotification = (notification: Omit<Notification, 'id'>) => {
    const { notifications, editingNotification } = this.state;
    let updatedNotifications: Notification[];

    if (editingNotification) {
      updatedNotifications = notifications.map((n) =>
        n.id === editingNotification.id
          ? { ...notification, id: editingNotification.id }
          : n
      );
    } else {
      const newNotification: Notification = {
        ...notification,
        id: `NOTIF-${Date.now()}`,
      };
      updatedNotifications = [...notifications, newNotification];
    }

    this.setState({ notifications: updatedNotifications });
    storageService.saveItems('billmate_notifications', updatedNotifications);
    this.handleCloseNotificationModal();
  };

  handleDeleteNotification = (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    const updatedNotifications = this.state.notifications.filter(
      (n) => n.id !== id
    );
    this.setState({ notifications: updatedNotifications });
    storageService.saveItems('billmate_notifications', updatedNotifications);
  };

  handleCloseNotificationModal = () => {
    this.setState({
      showNotificationModal: false,
      editingNotification: null,
    });
  };

  handleAddIntegration = () => {
    this.setState({
      showIntegrationModal: true,
      editingIntegration: null,
    });
  };

  handleEditIntegration = (integration: Integration) => {
    this.setState({
      showIntegrationModal: true,
      editingIntegration: integration,
    });
  };

  handleSaveIntegration = (integration: Omit<Integration, 'id'>) => {
    const { integrations, editingIntegration } = this.state;
    let updatedIntegrations: Integration[];

    if (editingIntegration) {
      updatedIntegrations = integrations.map((i) =>
        i.id === editingIntegration.id
          ? { ...integration, id: editingIntegration.id }
          : i
      );
    } else {
      const newIntegration: Integration = {
        ...integration,
        id: `INT-${Date.now()}`,
      };
      updatedIntegrations = [...integrations, newIntegration];
    }

    this.setState({ integrations: updatedIntegrations });
    storageService.saveItems('billmate_integrations', updatedIntegrations);
    this.handleCloseIntegrationModal();
  };

  handleDeleteIntegration = (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) {
      return;
    }

    const updatedIntegrations = this.state.integrations.filter(
      (i) => i.id !== id
    );
    this.setState({ integrations: updatedIntegrations });
    storageService.saveItems('billmate_integrations', updatedIntegrations);
  };

  handleCloseIntegrationModal = () => {
    this.setState({
      showIntegrationModal: false,
      editingIntegration: null,
    });
  };

  handleSecurityChange = (field: keyof SettingsState['securitySettings'], value: boolean | number) => {
    const updatedSecurity = {
      ...this.state.securitySettings,
      [field]: value,
    };
    this.setState({ securitySettings: updatedSecurity });
    storageService.saveItems('billmate_security', [updatedSecurity]);
  };

  handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  render() {
    const {
      notifications,
      integrations,
      showNotificationModal,
      showIntegrationModal,
      editingNotification,
      editingIntegration,
      securitySettings,
    } = this.state;

    return (
      <div className={styles.settings}>
        <header className={styles.settings__header}>
          <div className={styles.settings__header_container}>
            <div className={styles.settings__logo}>BillMate.io</div>
            <nav className={styles.settings__nav}>
              <Link href="/dashboard/analytics" className={styles.settings__nav_link}>
                Dashboard
              </Link>
              <Link href="/error" className={styles.settings__nav_link}>
                Invoices
              </Link>
              <Link href="/error" className={styles.settings__nav_link}>
                Debtors
              </Link>
              <Link href="/reports" className={styles.settings__nav_link}>
                Reports
              </Link>
              <Link
                href="/settings"
                className={`${styles.settings__nav_link} ${styles['settings__nav_link--active']}`}
              >
                Settings
              </Link>
            </nav>
            <div className={styles.settings__user}>
              <span className={styles.settings__user_icon}>👤</span>
              <Link href="/admin">Admin</Link>
              <button
                onClick={this.handleLogout}
                className={styles.settings__logout_button}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className={styles.settings__main}>
          <div className={styles.settings__container}>
            <h1 className={styles.settings__title}>Settings</h1>
            <p className={styles.settings__subtitle}>
              Manage your account preferences and configurations
            </p>

            {/* Notifications Section */}
            <div className={styles.settings__section}>
              <div className={styles.settings__section_header}>
                <h2 className={styles.settings__section_title}>
                  Notification Preferences
                </h2>
                <button
                  className={styles.settings__add_button}
                  onClick={this.handleAddNotification}
                >
                  + Add Notification
                </button>
              </div>
              <div className={styles.settings__list}>
                {notifications.map((notification) => (
                  <div key={notification.id} className={styles.settings__item}>
                    <div className={styles.settings__item_content}>
                      <h3 className={styles.settings__item_title}>
                        {notification.type}
                      </h3>
                      <div className={styles.settings__item_details}>
                        <span
                          className={`${styles.settings__badge} ${
                            notification.enabled
                              ? styles['settings__badge--active']
                              : styles['settings__badge--inactive']
                          }`}
                        >
                          {notification.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        {notification.email && (
                          <span className={styles.settings__tag}>Email</span>
                        )}
                        {notification.sms && (
                          <span className={styles.settings__tag}>SMS</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.settings__item_actions}>
                      <button
                        className={styles.settings__edit_button}
                        onClick={() => this.handleEditNotification(notification)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.settings__delete_button}
                        onClick={() => this.handleDeleteNotification(notification.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Section */}
            <div className={styles.settings__section}>
              <div className={styles.settings__section_header}>
                <h2 className={styles.settings__section_title}>Security</h2>
              </div>
              <div className={styles.settings__security}>
                <div className={styles.settings__security_item}>
                  <div>
                    <h3 className={styles.settings__security_title}>
                      Two-Factor Authentication
                    </h3>
                    <p className={styles.settings__security_description}>
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className={styles.settings__toggle}>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) =>
                        this.handleSecurityChange('twoFactorAuth', e.target.checked)
                      }
                    />
                    <span className={styles.settings__toggle_slider}></span>
                  </label>
                </div>
                <div className={styles.settings__security_item}>
                  <div>
                    <h3 className={styles.settings__security_title}>
                      Session Timeout (minutes)
                    </h3>
                    <p className={styles.settings__security_description}>
                      Automatically log out after inactivity
                    </p>
                  </div>
                  <input
                    type="number"
                    className={styles.settings__input}
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      this.handleSecurityChange(
                        'sessionTimeout',
                        parseInt(e.target.value) || 30
                      )
                    }
                    min="5"
                    max="120"
                  />
                </div>
                <div className={styles.settings__security_item}>
                  <div>
                    <h3 className={styles.settings__security_title}>
                      Password Expiry (days)
                    </h3>
                    <p className={styles.settings__security_description}>
                      Require password change after specified days
                    </p>
                  </div>
                  <input
                    type="number"
                    className={styles.settings__input}
                    value={securitySettings.passwordExpiry}
                    onChange={(e) =>
                      this.handleSecurityChange(
                        'passwordExpiry',
                        parseInt(e.target.value) || 90
                      )
                    }
                    min="30"
                    max="365"
                  />
                </div>
              </div>
            </div>

            {/* Integrations Section */}
            <div className={styles.settings__section}>
              <div className={styles.settings__section_header}>
                <h2 className={styles.settings__section_title}>Integrations</h2>
                <button
                  className={styles.settings__add_button}
                  onClick={this.handleAddIntegration}
                >
                  + Add Integration
                </button>
              </div>
              <div className={styles.settings__list}>
                {integrations.map((integration) => (
                  <div key={integration.id} className={styles.settings__item}>
                    <div className={styles.settings__item_content}>
                      <h3 className={styles.settings__item_title}>
                        {integration.name}
                      </h3>
                      <div className={styles.settings__item_details}>
                        <span className={styles.settings__tag}>{integration.type}</span>
                        <span
                          className={`${styles.settings__badge} ${
                            integration.status === 'active'
                              ? styles['settings__badge--active']
                              : styles['settings__badge--inactive']
                          }`}
                        >
                          {integration.status}
                        </span>
                      </div>
                    </div>
                    <div className={styles.settings__item_actions}>
                      <button
                        className={styles.settings__edit_button}
                        onClick={() => this.handleEditIntegration(integration)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.settings__delete_button}
                        onClick={() => this.handleDeleteIntegration(integration.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <NotificationModal
          isOpen={showNotificationModal}
          onClose={this.handleCloseNotificationModal}
          onSave={this.handleSaveNotification}
          notification={editingNotification}
        />

        <IntegrationModal
          isOpen={showIntegrationModal}
          onClose={this.handleCloseIntegrationModal}
          onSave={this.handleSaveIntegration}
          integration={editingIntegration}
        />
      </div>
    );
  }
}

export default Settings;
