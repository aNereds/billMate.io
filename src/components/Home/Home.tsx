'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import styles from './Home.module.scss';
import { authService } from '@/utils/auth';

interface HomeState {
  isAuthenticated: boolean;
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    this.setState({ isAuthenticated: authService.isAuthenticated() });
  }

  handleGetStarted = () => {
    if (this.state.isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/onboarding';
    }
  };

  handleLogout = () => {
    authService.logout();
    this.setState({ isAuthenticated: false });
    window.location.href = '/';
  };

  render() {
    const { isAuthenticated } = this.state;

    return (
      <div className={styles.home}>
        <header className={styles.home__header}>
          <div className={styles.home__header_container}>
            <div className={styles.home__logo}>BillMate.io</div>
            <nav className={styles.home__nav}>
              <Link href="#features" className={styles.home__nav_link}>
                Features
              </Link>
              <Link href="#services" className={styles.home__nav_link}>
                Services
              </Link>
              <Link href="#about" className={styles.home__nav_link}>
                About
              </Link>
              <Link href="#contact" className={styles.home__nav_link}>
                Contact
              </Link>
            </nav>
            <div className={styles.home__auth}>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className={styles.home__button_primary}>
                    Dashboard
                  </Link>
                  <button
                    onClick={this.handleLogout}
                    className={styles.home__button_logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/onboarding"
                    className={styles.home__button_secondary}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/onboarding"
                    className={styles.home__button_primary}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className={styles.home__main}>
          <section className={styles.home__hero}>
            <div className={styles.home__hero_container}>
              <h1 className={styles.home__hero_title}>
                Modern Factoring Platform
              </h1>
              <p className={styles.home__hero_subtitle}>
                Streamline your invoice financing with our advanced factoring
                solution. Get paid faster, manage debtors efficiently, and grow
                your business.
              </p>
              <div className={styles.home__hero_actions}>
                <button
                  className={styles.home__button_primary_large}
                  onClick={this.handleGetStarted}
                >
                  Get Started
                </button>
                <button className={styles.home__button_secondary_large}>
                  Learn More
                </button>
              </div>
            </div>
          </section>

          <section id="features" className={styles.home__features}>
            <div className={styles.home__container}>
              <h2 className={styles.home__section_title}>Key Features</h2>
              <div className={styles.home__features_grid}>
                <div className={styles.home__feature_card}>
                  <div className={styles.home__feature_icon}>⚡</div>
                  <h3 className={styles.home__feature_title}>
                    Fast Processing
                  </h3>
                  <p className={styles.home__feature_description}>
                    Get your invoices processed and paid within 24 hours
                  </p>
                </div>
                <div className={styles.home__feature_card}>
                  <div className={styles.home__feature_icon}>🔒</div>
                  <h3 className={styles.home__feature_title}>Secure</h3>
                  <p className={styles.home__feature_description}>
                    Bank-level security with SmartID and Swedbank integration
                  </p>
                </div>
                <div className={styles.home__feature_card}>
                  <div className={styles.home__feature_icon}>📊</div>
                  <h3 className={styles.home__feature_title}>Analytics</h3>
                  <p className={styles.home__feature_description}>
                    Real-time insights into your cash flow and debtor management
                  </p>
                </div>
                <div className={styles.home__feature_card}>
                  <div className={styles.home__feature_icon}>🌍</div>
                  <h3 className={styles.home__feature_title}>Multi-Country</h3>
                  <p className={styles.home__feature_description}>
                    Support for Latvia, Estonia, Lithuania, and more
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className={styles.home__services}>
            <div className={styles.home__container}>
              <h2 className={styles.home__section_title}>Our Services</h2>
              <div className={styles.home__services_grid}>
                <div className={styles.home__service_card}>
                  <h3 className={styles.home__service_title}>
                    Invoice Factoring
                  </h3>
                  <p className={styles.home__service_description}>
                    Sell your outstanding invoices and get immediate cash flow
                  </p>
                </div>
                <div className={styles.home__service_card}>
                  <h3 className={styles.home__service_title}>
                    Debtor Management
                  </h3>
                  <p className={styles.home__service_description}>
                    Track and manage your debtors efficiently
                  </p>
                </div>
                <div className={styles.home__service_card}>
                  <h3 className={styles.home__service_title}>
                    Credit Control
                  </h3>
                  <p className={styles.home__service_description}>
                    Monitor credit limits and manage risk effectively
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className={styles.home__contact}>
            <div className={styles.home__container}>
              <h2 className={styles.home__section_title}>Contact Us</h2>
              <div className={styles.home__contact_info}>
                <div className={styles.home__contact_item}>
                  <div className={styles.home__contact_icon}>📧</div>
                  <div>
                    <h3>Email</h3>
                    <p>
                      <a
                        href="mailto:info@billmate.io"
                        className={styles.home__contact_link}
                      >
                        info@billmate.io
                      </a>
                    </p>
                  </div>
                </div>
                <div className={styles.home__contact_item}>
                  <div className={styles.home__contact_icon}>📱</div>
                  <div>
                    <h3>Phone</h3>
                    <p>
                      <a
                        href="tel:+37125766132"
                        className={styles.home__contact_link}
                      >
                        +371 25766132
                      </a>
                    </p>
                  </div>
                </div>
                <div className={styles.home__contact_item}>
                  <div className={styles.home__contact_icon}>📍</div>
                  <div>
                    <h3>Address</h3>
                    <p>Riga, Latvia</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.home__footer}>
          <div className={styles.home__container}>
            <p>© 2024 BillMate.io. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
