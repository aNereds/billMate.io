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
  LineChart,
  Line,
} from 'recharts';
import styles from './Analytics.module.scss';
import { authService } from '@/utils/auth';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

interface AnalyticsState {
  selectedPeriod: 'week' | 'month' | 'quarter' | 'year';
  selectedCategory: 'all' | 'invoices' | 'debtors' | 'payouts';
  isMobileMenuOpen: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const getInvoiceStatusData = (period: string, category: string) => {
  const baseData = {
    week: [
      { name: 'Approved', value: 35, color: '#10b981' },
      { name: 'Processing', value: 30, color: '#3b82f6' },
      { name: 'Pending', value: 25, color: '#f59e0b' },
      { name: 'Paid', value: 8, color: '#8b5cf6' },
      { name: 'Rejected', value: 2, color: '#ef4444' },
    ],
    month: [
      { name: 'Approved', value: 45, color: '#10b981' },
      { name: 'Processing', value: 25, color: '#3b82f6' },
      { name: 'Pending', value: 20, color: '#f59e0b' },
      { name: 'Paid', value: 15, color: '#8b5cf6' },
      { name: 'Rejected', value: 5, color: '#ef4444' },
    ],
    quarter: [
      { name: 'Approved', value: 50, color: '#10b981' },
      { name: 'Processing', value: 20, color: '#3b82f6' },
      { name: 'Pending', value: 15, color: '#f59e0b' },
      { name: 'Paid', value: 12, color: '#8b5cf6' },
      { name: 'Rejected', value: 3, color: '#ef4444' },
    ],
    year: [
      { name: 'Approved', value: 55, color: '#10b981' },
      { name: 'Processing', value: 18, color: '#3b82f6' },
      { name: 'Pending', value: 12, color: '#f59e0b' },
      { name: 'Paid', value: 10, color: '#8b5cf6' },
      { name: 'Rejected', value: 5, color: '#ef4444' },
    ],
  };

  if (category === 'invoices' || category === 'all') {
    return baseData[period as keyof typeof baseData] || baseData.month;
  }
  return baseData.month;
};

const getRevenueData = (period: string) => {
  const data = {
    week: [
      { period: 'Mon', revenue: 25000, expenses: 18000 },
      { period: 'Tue', revenue: 28000, expenses: 20000 },
      { period: 'Wed', revenue: 32000, expenses: 22000 },
      { period: 'Thu', revenue: 30000, expenses: 21000 },
      { period: 'Fri', revenue: 35000, expenses: 24000 },
      { period: 'Sat', revenue: 20000, expenses: 15000 },
      { period: 'Sun', revenue: 15000, expenses: 12000 },
    ],
    month: [
      { period: 'Week 1', revenue: 125000, expenses: 95000 },
      { period: 'Week 2', revenue: 145000, expenses: 110000 },
      { period: 'Week 3', revenue: 165000, expenses: 120000 },
      { period: 'Week 4', revenue: 185000, expenses: 140000 },
    ],
    quarter: [
      { period: 'Jan', revenue: 125000, expenses: 95000 },
      { period: 'Feb', revenue: 145000, expenses: 110000 },
      { period: 'Mar', revenue: 165000, expenses: 120000 },
    ],
    year: [
      { period: 'Q1', revenue: 435000, expenses: 325000 },
      { period: 'Q2', revenue: 485000, expenses: 365000 },
      { period: 'Q3', revenue: 525000, expenses: 395000 },
      { period: 'Q4', revenue: 575000, expenses: 425000 },
    ],
  };
  return data[period as keyof typeof data] || data.month;
};

const getCategoryData = (period: string, category: string) => {
  const baseData = {
    week: [
      { category: 'Technology', amount: 120000, count: 12 },
      { category: 'Manufacturing', amount: 85000, count: 8 },
      { category: 'Retail', amount: 70000, count: 7 },
      { category: 'Services', amount: 55000, count: 5 },
      { category: 'Other', amount: 40000, count: 4 },
    ],
    month: [
      { category: 'Technology', amount: 450000, count: 45 },
      { category: 'Manufacturing', amount: 320000, count: 32 },
      { category: 'Retail', amount: 280000, count: 28 },
      { category: 'Services', amount: 210000, count: 21 },
      { category: 'Other', amount: 150000, count: 15 },
    ],
    quarter: [
      { category: 'Technology', amount: 1350000, count: 135 },
      { category: 'Manufacturing', amount: 960000, count: 96 },
      { category: 'Retail', amount: 840000, count: 84 },
      { category: 'Services', amount: 630000, count: 63 },
      { category: 'Other', amount: 450000, count: 45 },
    ],
    year: [
      { category: 'Technology', amount: 5400000, count: 540 },
      { category: 'Manufacturing', amount: 3840000, count: 384 },
      { category: 'Retail', amount: 3360000, count: 336 },
      { category: 'Services', amount: 2520000, count: 252 },
      { category: 'Other', amount: 1800000, count: 180 },
    ],
  };

  if (category === 'all' || category === 'invoices') {
    return baseData[period as keyof typeof baseData] || baseData.month;
  }
  return baseData.month;
};

const getDebtorStatusData = (period: string, category: string) => {
  const baseData = {
    week: [
      { name: 'Active', value: 70, color: '#10b981' },
      { name: 'Pending', value: 18, color: '#f59e0b' },
      { name: 'Blocked', value: 8, color: '#ef4444' },
      { name: 'Review', value: 4, color: '#3b82f6' },
    ],
    month: [
      { name: 'Active', value: 65, color: '#10b981' },
      { name: 'Pending', value: 20, color: '#f59e0b' },
      { name: 'Blocked', value: 10, color: '#ef4444' },
      { name: 'Review', value: 5, color: '#3b82f6' },
    ],
    quarter: [
      { name: 'Active', value: 60, color: '#10b981' },
      { name: 'Pending', value: 22, color: '#f59e0b' },
      { name: 'Blocked', value: 12, color: '#ef4444' },
      { name: 'Review', value: 6, color: '#3b82f6' },
    ],
    year: [
      { name: 'Active', value: 55, color: '#10b981' },
      { name: 'Pending', value: 25, color: '#f59e0b' },
      { name: 'Blocked', value: 15, color: '#ef4444' },
      { name: 'Review', value: 5, color: '#3b82f6' },
    ],
  };

  if (category === 'all' || category === 'debtors') {
    return baseData[period as keyof typeof baseData] || baseData.month;
  }
  return baseData.month;
};

const getTrendData = (period: string, category: string) => {
  const data = {
    week: [
      { period: 'Mon', invoices: 8, payouts: 5 },
      { period: 'Tue', invoices: 10, payouts: 6 },
      { period: 'Wed', invoices: 12, payouts: 7 },
      { period: 'Thu', invoices: 11, payouts: 8 },
      { period: 'Fri', invoices: 14, payouts: 9 },
      { period: 'Sat', invoices: 6, payouts: 4 },
      { period: 'Sun', invoices: 4, payouts: 3 },
    ],
    month: [
      { period: 'Week 1', invoices: 12, payouts: 8 },
      { period: 'Week 2', invoices: 15, payouts: 10 },
      { period: 'Week 3', invoices: 18, payouts: 12 },
      { period: 'Week 4', invoices: 20, payouts: 15 },
    ],
    quarter: [
      { period: 'Jan', invoices: 65, payouts: 45 },
      { period: 'Feb', invoices: 72, payouts: 50 },
      { period: 'Mar', invoices: 78, payouts: 55 },
    ],
    year: [
      { period: 'Q1', invoices: 215, payouts: 150 },
      { period: 'Q2', invoices: 245, payouts: 170 },
      { period: 'Q3', invoices: 265, payouts: 185 },
      { period: 'Q4', invoices: 285, payouts: 200 },
    ],
  };

  if (category === 'all' || category === 'invoices' || category === 'payouts') {
    return data[period as keyof typeof data] || data.month;
  }
  return data.month;
};

const getSummaryData = (period: string) => {
  const data = {
    week: {
      revenue: 195000,
      expenses: 132000,
      clients: 142,
      revenueChange: '+8.5%',
      expensesChange: '+5.2%',
      profitChange: '+12.3%',
      clientsChange: '+2.1%',
    },
    month: {
      revenue: 620000,
      expenses: 465000,
      clients: 142,
      revenueChange: '+12.5%',
      expensesChange: '+8.3%',
      profitChange: '+15.2%',
      clientsChange: '+5.7%',
    },
    quarter: {
      revenue: 435000,
      expenses: 325000,
      clients: 145,
      revenueChange: '+18.2%',
      expensesChange: '+12.5%',
      profitChange: '+22.5%',
      clientsChange: '+8.3%',
    },
    year: {
      revenue: 2020000,
      expenses: 1510000,
      clients: 150,
      revenueChange: '+25.5%',
      expensesChange: '+18.7%',
      profitChange: '+32.1%',
      clientsChange: '+12.4%',
    },
  };
  return data[period as keyof typeof data] || data.month;
};

class Analytics extends Component<{}, AnalyticsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedPeriod: 'month',
      selectedCategory: 'all',
      isMobileMenuOpen: false,
    };
  }

  componentDidMount() {
    if (!authService.isAuthenticated()) {
      window.location.href = '/onboarding';
      return;
    }

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

  handlePeriodChange = (period: AnalyticsState['selectedPeriod']) => {
    this.setState({ selectedPeriod: period });
  };

  handleCategoryChange = (category: AnalyticsState['selectedCategory']) => {
    this.setState({ selectedCategory: category });
  };

  handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  render() {
    const { selectedPeriod, selectedCategory } = this.state;

    const invoiceStatusData = getInvoiceStatusData(selectedPeriod, selectedCategory);
    const revenueData = getRevenueData(selectedPeriod);
    const categoryDistributionData = getCategoryData(selectedPeriod, selectedCategory);
    const debtorStatusData = getDebtorStatusData(selectedPeriod, selectedCategory);
    const trendData = getTrendData(selectedPeriod, selectedCategory);
    const summaryData = getSummaryData(selectedPeriod);

    const totalRevenue = revenueData.reduce(
      (sum, item) => sum + (item.revenue || 0),
      0
    );
    const totalExpenses = revenueData.reduce(
      (sum, item) => sum + (item.expenses || 0),
      0
    );
    const netProfit = totalRevenue - totalExpenses;

    return (
      <div className={styles.analytics}>
        <header className={styles.analytics__header}>
          <div className={styles.analytics__header_container}>
            <div className={styles.analytics__logo}>BillApp.io</div>
            <nav className={styles.analytics__nav}>
              <Link
                href="/dashboard/analytics"
                className={`${styles.analytics__nav_link} ${styles['analytics__nav_link--active']}`}
              >
                Dashboard
              </Link>
              <Link href="/invoices" className={styles.analytics__nav_link}>
                Invoices
              </Link>
              <Link href="/debtors" className={styles.analytics__nav_link}>
                Debtors
              </Link>
              <Link href="/reports" className={styles.analytics__nav_link}>
                Reports
              </Link>
              <Link href="/settings" className={styles.analytics__nav_link}>
                Settings
              </Link>
            </nav>
            <div className={styles.analytics__user}>
              <span className={styles.analytics__user_icon}>👤</span>
              <Link href="/admin" className={styles.analytics__admin_link}>Admin</Link>
              <button
                onClick={this.handleLogout}
                className={styles.analytics__logout_button}
              >
                Logout
              </button>
            </div>
            <button
              className={styles.analytics__burger}
              onClick={this.handleToggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span
                className={`${styles.analytics__burger_line} ${
                  this.state.isMobileMenuOpen
                    ? styles['analytics__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.analytics__burger_line} ${
                  this.state.isMobileMenuOpen
                    ? styles['analytics__burger_line--open']
                    : ''
                }`}
              ></span>
              <span
                className={`${styles.analytics__burger_line} ${
                  this.state.isMobileMenuOpen
                    ? styles['analytics__burger_line--open']
                    : ''
                }`}
              ></span>
            </button>
          </div>
          {this.state.isMobileMenuOpen && (
            <div className={styles.analytics__mobile_menu}>
              <Link
                href="/dashboard/analytics"
                className={`${styles.analytics__mobile_menu_item} ${styles['analytics__mobile_menu_item--active']}`}
                onClick={this.handleCloseMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className={styles.analytics__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Invoices
              </Link>
              <Link
                href="/debtors"
                className={styles.analytics__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Debtors
              </Link>
              <Link
                href="/reports"
                className={styles.analytics__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Reports
              </Link>
              <Link
                href="/settings"
                className={styles.analytics__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                Settings
              </Link>
              <Link
                href="/admin"
                className={styles.analytics__mobile_menu_item}
                onClick={this.handleCloseMobileMenu}
              >
                👤 Admin
              </Link>
              <button
                onClick={() => {
                  this.handleCloseMobileMenu();
                  this.handleLogout();
                }}
                className={`${styles.analytics__mobile_menu_item} ${styles['analytics__mobile_menu_item--logout']}`}
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main className={styles.analytics__main}>
          <div className={styles.analytics__container}>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Dashboard', href: '/dashboard/analytics' },
                { label: 'Analytics' },
              ]}
            />
            <div className={styles.analytics__header_section}>
              <h1 className={styles.analytics__title}>Analytics Dashboard</h1>
              <p className={styles.analytics__subtitle}>
                Comprehensive insights and performance metrics
              </p>
            </div>

            {/* Filters */}
            <div className={styles.analytics__filters}>
              <div className={styles.analytics__filter_group}>
                <label className={styles.analytics__filter_label}>Period:</label>
                <div className={styles.analytics__filter_buttons}>
                  {(['week', 'month', 'quarter', 'year'] as const).map(
                    (period) => (
                      <button
                        key={period}
                        className={`${styles.analytics__filter_button} ${
                          selectedPeriod === period
                            ? styles['analytics__filter_button--active']
                            : ''
                        }`}
                        onClick={() => this.handlePeriodChange(period)}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className={styles.analytics__filter_group}>
                <label className={styles.analytics__filter_label}>Category:</label>
                <div className={styles.analytics__filter_buttons}>
                  {(['all', 'invoices', 'debtors', 'payouts'] as const).map(
                    (category) => (
                      <button
                        key={category}
                        className={`${styles.analytics__filter_button} ${
                          selectedCategory === category
                            ? styles['analytics__filter_button--active']
                            : ''
                        }`}
                        onClick={() => this.handleCategoryChange(category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className={styles.analytics__summary}>
              <div className={styles.analytics__summary_card}>
                <h3 className={styles.analytics__summary_title}>Total Revenue</h3>
                <p className={styles.analytics__summary_amount}>
                  €{summaryData.revenue.toLocaleString()}
                </p>
                <span className={styles.analytics__summary_change}>
                  {summaryData.revenueChange}
                </span>
              </div>
              <div className={styles.analytics__summary_card}>
                <h3 className={styles.analytics__summary_title}>Total Expenses</h3>
                <p className={styles.analytics__summary_amount}>
                  €{summaryData.expenses.toLocaleString()}
                </p>
                <span className={styles.analytics__summary_change}>
                  {summaryData.expensesChange}
                </span>
              </div>
              <div className={styles.analytics__summary_card}>
                <h3 className={styles.analytics__summary_title}>Net Profit</h3>
                <p className={styles.analytics__summary_amount}>
                  €{netProfit.toLocaleString()}
                </p>
                <span className={styles.analytics__summary_change_positive}>
                  {summaryData.profitChange}
                </span>
              </div>
              <div className={styles.analytics__summary_card}>
                <h3 className={styles.analytics__summary_title}>Active Clients</h3>
                <p className={styles.analytics__summary_amount}>
                  {summaryData.clients}
                </p>
                <span className={styles.analytics__summary_change}>
                  {summaryData.clientsChange}
                </span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className={styles.analytics__charts}>
              {/* Pie Chart - Invoice Status */}
              <div className={styles.analytics__chart_card}>
                <h2 className={styles.analytics__chart_title}>
                  Invoice Status Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart - Revenue & Expenses */}
              <div className={styles.analytics__chart_card}>
                <h2 className={styles.analytics__chart_title}>
                  Revenue & Expenses
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Debtor Status */}
              <div className={styles.analytics__chart_card}>
                <h2 className={styles.analytics__chart_title}>
                  Debtor Status Overview
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={debtorStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {debtorStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart - Category Distribution */}
              <div className={styles.analytics__chart_card}>
                <h2 className={styles.analytics__chart_title}>
                  Category Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#8b5cf6" name="Amount (EUR)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart - Trends */}
              <div className={styles.analytics__chart_card}>
                <h2 className={styles.analytics__chart_title}>
                  Weekly Trends
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="invoices"
                      stroke="#3b82f6"
                      name="Invoices"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="payouts"
                      stroke="#10b981"
                      name="Payouts"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Horizontal Bar Chart - Top Categories */}
              <div className={styles.analytics__chart_card}>
                <h2 className={styles.analytics__chart_title}>
                  Top Categories by Count
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={categoryDistributionData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Analytics;
