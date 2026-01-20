'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import styles from './Reports.module.scss';
import { authService } from '@/utils/auth';
import { storageService } from '@/utils/storage';
import ReportModal from './ReportModal';

interface Report {
  id: string;
  name: string;
  type: string;
  period: string;
  status: 'scheduled' | 'completed' | 'failed';
  lastRun?: string;
  nextRun?: string;
}

interface ReportsState {
  reports: Report[];
  showReportModal: boolean;
  editingReport: Report | null;
}

const DEFAULT_REPORTS: Report[] = [
  {
    id: '1',
    name: 'Monthly Financial Summary',
    type: 'Financial',
    period: 'Monthly',
    status: 'scheduled',
    lastRun: '2024-01-31',
    nextRun: '2024-02-29',
  },
  {
    id: '2',
    name: 'Invoice Status Report',
    type: 'Invoice',
    period: 'Weekly',
    status: 'completed',
    lastRun: '2024-02-05',
    nextRun: '2024-02-12',
  },
  {
    id: '3',
    name: 'Debtor Analysis',
    type: 'Debtor',
    period: 'Monthly',
    status: 'completed',
    lastRun: '2024-01-31',
    nextRun: '2024-02-29',
  },
  {
    id: '4',
    name: 'Payment Reconciliation',
    type: 'Payment',
    period: 'Daily',
    status: 'scheduled',
    lastRun: '2024-02-06',
    nextRun: '2024-02-07',
  },
];

class Reports extends Component<{}, ReportsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      reports: [],
      showReportModal: false,
      editingReport: null,
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
    const storedReports = storageService.getItems<Report>('billmate_reports');
    this.setState({
      reports:
        storedReports.length > 0 ? storedReports : DEFAULT_REPORTS,
    });
  };

  handleAddReport = () => {
    this.setState({
      showReportModal: true,
      editingReport: null,
    });
  };

  handleEditReport = (report: Report) => {
    this.setState({
      showReportModal: true,
      editingReport: report,
    });
  };

  handleSaveReport = (report: Omit<Report, 'id'>) => {
    const { reports, editingReport } = this.state;
    let updatedReports: Report[];

    if (editingReport) {
      updatedReports = reports.map((r) =>
        r.id === editingReport.id
          ? { ...report, id: editingReport.id }
          : r
      );
    } else {
      const newReport: Report = {
        ...report,
        id: `RPT-${Date.now()}`,
      };
      updatedReports = [...reports, newReport];
    }

    this.setState({ reports: updatedReports });
    storageService.saveItems('billmate_reports', updatedReports);
    this.handleCloseReportModal();
  };

  handleDeleteReport = (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    const updatedReports = this.state.reports.filter((r) => r.id !== id);
    this.setState({ reports: updatedReports });
    storageService.saveItems('billmate_reports', updatedReports);
  };

  handleRunReport = (id: string) => {
    const report = this.state.reports.find((r) => r.id === id);
    if (report) {
      alert(`Running report: ${report.name}`);
      // Simulate report run
      const updatedReports = this.state.reports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'completed' as const,
              lastRun: new Date().toISOString().split('T')[0],
            }
          : r
      );
      this.setState({ reports: updatedReports });
      storageService.saveItems('billmate_reports', updatedReports);
    }
  };

  handleCloseReportModal = () => {
    this.setState({
      showReportModal: false,
      editingReport: null,
    });
  };

  handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  render() {
    const { reports, showReportModal, editingReport } = this.state;

    return (
      <div className={styles.reports}>
        <header className={styles.reports__header}>
          <div className={styles.reports__header_container}>
            <div className={styles.reports__logo}>BillMate.io</div>
            <nav className={styles.reports__nav}>
              <Link href="/dashboard/analytics" className={styles.reports__nav_link}>
                Dashboard
              </Link>
              <Link href="/error" className={styles.reports__nav_link}>
                Invoices
              </Link>
              <Link href="/error" className={styles.reports__nav_link}>
                Debtors
              </Link>
              <Link
                href="/reports"
                className={`${styles.reports__nav_link} ${styles['reports__nav_link--active']}`}
              >
                Reports
              </Link>
              <Link href="/settings" className={styles.reports__nav_link}>
                Settings
              </Link>
            </nav>
            <div className={styles.reports__user}>
              <span className={styles.reports__user_icon}>👤</span>
              <Link href="/admin">Admin</Link>
              <button
                onClick={this.handleLogout}
                className={styles.reports__logout_button}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className={styles.reports__main}>
          <div className={styles.reports__container}>
            <div className={styles.reports__header_section}>
              <div>
                <h1 className={styles.reports__title}>Reports</h1>
                <p className={styles.reports__subtitle}>
                  Generate and manage automated reports
                </p>
              </div>
              <button
                className={styles.reports__add_button}
                onClick={this.handleAddReport}
              >
                + Create Report
              </button>
            </div>

            <div className={styles.reports__grid}>
              {reports.map((report) => (
                <div key={report.id} className={styles.reports__card}>
                  <div className={styles.reports__card_header}>
                    <h3 className={styles.reports__card_title}>{report.name}</h3>
                    <span
                      className={`${styles.reports__badge} ${
                        styles[`reports__badge--${report.status}`]
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <div className={styles.reports__card_body}>
                    <div className={styles.reports__card_info}>
                      <span className={styles.reports__card_label}>Type:</span>
                      <span className={styles.reports__card_value}>
                        {report.type}
                      </span>
                    </div>
                    <div className={styles.reports__card_info}>
                      <span className={styles.reports__card_label}>Period:</span>
                      <span className={styles.reports__card_value}>
                        {report.period}
                      </span>
                    </div>
                    {report.lastRun && (
                      <div className={styles.reports__card_info}>
                        <span className={styles.reports__card_label}>
                          Last Run:
                        </span>
                        <span className={styles.reports__card_value}>
                          {report.lastRun}
                        </span>
                      </div>
                    )}
                    {report.nextRun && (
                      <div className={styles.reports__card_info}>
                        <span className={styles.reports__card_label}>
                          Next Run:
                        </span>
                        <span className={styles.reports__card_value}>
                          {report.nextRun}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.reports__card_actions}>
                    <button
                      className={styles.reports__run_button}
                      onClick={() => this.handleRunReport(report.id)}
                    >
                      Run Now
                    </button>
                    <button
                      className={styles.reports__edit_button}
                      onClick={() => this.handleEditReport(report)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.reports__delete_button}
                      onClick={() => this.handleDeleteReport(report.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <ReportModal
          isOpen={showReportModal}
          onClose={this.handleCloseReportModal}
          onSave={this.handleSaveReport}
          report={editingReport}
        />
      </div>
    );
  }
}

export default Reports;
