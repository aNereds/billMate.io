'use client';

import React, { Component } from 'react';
import styles from './Header.module.scss';

interface HeaderState {
  isMenuOpen: boolean;
  isScrolled: boolean;
}

class Header extends Component<{}, HeaderState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isMenuOpen: false,
      isScrolled: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleScroll = () => {
    const isScrolled = window.scrollY > 50;
    if (this.state.isScrolled !== isScrolled) {
      this.setState({ isScrolled });
    }
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  closeMenu = () => {
    if (this.state.isMenuOpen) {
      this.setState({ isMenuOpen: false });
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.closeMenu();
    }
  };

  handleNavLinkClick = () => {
    this.closeMenu();
  };

  render() {
    const { isMenuOpen, isScrolled } = this.state;
    
    const headerClass = `${styles.header} ${isScrolled ? styles['header--scrolled'] : ''}`;
    const navClass = `${styles.header__nav} ${isMenuOpen ? styles['header__nav--open'] : ''}`;

    return (
      <header className={headerClass}>
        <div className={styles.header__container}>
          <div className={styles.header__logo}>
            <span className={styles.header__logo_text}>Logo</span>
          </div>

          <nav className={navClass} id="primary-navigation" aria-label="Основная навигация">
            <ul className={styles.header__menu}>
              <li className={styles.header__menu_item}>
                <a href="#hero" className={styles.header__menu_link} onClick={this.handleNavLinkClick}>
                  Главная
                </a>
              </li>
              <li className={styles.header__menu_item}>
                <a href="#features" className={styles.header__menu_link} onClick={this.handleNavLinkClick}>
                  Возможности
                </a>
              </li>
              <li className={styles.header__menu_item}>
                <a href="#services" className={styles.header__menu_link} onClick={this.handleNavLinkClick}>
                  Услуги
                </a>
              </li>
              <li className={styles.header__menu_item}>
                <a href="#contact" className={styles.header__menu_link} onClick={this.handleNavLinkClick}>
                  Контакты
                </a>
              </li>
            </ul>
          </nav>

          <button 
            className={styles.header__burger}
            onClick={this.toggleMenu}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
          >
            <span className={styles.header__burger_line}></span>
            <span className={styles.header__burger_line}></span>
            <span className={styles.header__burger_line}></span>
          </button>
        </div>
      </header>
    );
  }
}

export default Header;
