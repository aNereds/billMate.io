'use client';

import React, { Component } from 'react';
import styles from './Footer.module.scss';

interface FooterProps {}

interface FooterState {
  currentYear: number;
}

class Footer extends Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props);
    this.state = {
      currentYear: new Date().getFullYear(),
    };
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  render() {
    const { currentYear } = this.state;

    const footerLinks = {
      company: [
        { text: 'О нас', href: '#about' },
        { text: 'Команда', href: '#team' },
        { text: 'Карьера', href: '#career' },
        { text: 'Контакты', href: '#contact' },
      ],
      services: [
        { text: 'Веб-разработка', href: '#services' },
        { text: 'Мобильные приложения', href: '#services' },
        { text: 'UI/UX Дизайн', href: '#services' },
        { text: 'Консультации', href: '#services' },
      ],
      resources: [
        { text: 'Блог', href: '#blog' },
        { text: 'Портфолио', href: '#portfolio' },
        { text: 'Документация', href: '#docs' },
        { text: 'Поддержка', href: '#support' },
      ],
    };

    const socialLinks = [
      { name: 'GitHub', icon: '💻', href: 'https://github.com' },
      { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com' },
      { name: 'Twitter', icon: '🐦', href: 'https://twitter.com' },
      { name: 'Telegram', icon: '✈️', href: 'https://telegram.org' },
    ];

    return (
      <footer className={styles.footer}>
        <div className={styles.footer__container}>
          <div className={styles.footer__top}>
            <div className={styles.footer__column}>
              <div className={styles.footer__logo}>
                <span className={styles.footer__logo_text}>Logo</span>
              </div>
              <p className={styles.footer__description}>
                Создаем современные веб-решения для вашего бизнеса. Качество, инновации и
                индивидуальный подход к каждому проекту.
              </p>
              <div className={styles.footer__social}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={styles.footer__social_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.footer__column}>
              <h3 className={styles.footer__column_title}>Компания</h3>
              <ul className={styles.footer__links}>
                {footerLinks.company.map((link, index) => (
                  <li key={index} className={styles.footer__links_item}>
                    <a href={link.href} className={styles.footer__links_link}>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.footer__column}>
              <h3 className={styles.footer__column_title}>Услуги</h3>
              <ul className={styles.footer__links}>
                {footerLinks.services.map((link, index) => (
                  <li key={index} className={styles.footer__links_item}>
                    <a href={link.href} className={styles.footer__links_link}>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.footer__column}>
              <h3 className={styles.footer__column_title}>Ресурсы</h3>
              <ul className={styles.footer__links}>
                {footerLinks.resources.map((link, index) => (
                  <li key={index} className={styles.footer__links_item}>
                    <a href={link.href} className={styles.footer__links_link}>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.footer__bottom}>
            <p className={styles.footer__copyright}>
              © {currentYear} Next.js BEM App. Все права защищены.
            </p>
            <div className={styles.footer__legal}>
              <a href="#privacy" className={styles.footer__legal_link}>
                Политика конфиденциальности
              </a>
              <a href="#terms" className={styles.footer__legal_link}>
                Условия использования
              </a>
            </div>
          </div>

          <button
            className={styles.footer__scroll_top}
            onClick={this.scrollToTop}
            aria-label="Прокрутить наверх"
          >
            ↑
          </button>
        </div>
      </footer>
    );
  }
}

export default Footer;
