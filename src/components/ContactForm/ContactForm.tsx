'use client';

import React, { Component } from 'react';
import styles from './ContactForm.module.scss';

interface ContactFormProps {}

interface ContactFormState {
  formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  isSubmitting: boolean;
  submitSuccess: boolean;
}

class ContactForm extends Component<ContactFormProps, ContactFormState> {
  constructor(props: ContactFormProps) {
    super(props);
    this.state = {
      formData: {
        name: '',
        email: '',
        phone: '',
        message: '',
      },
      errors: {},
      isSubmitting: false,
      submitSuccess: false,
    };
  }

  validateForm = (): boolean => {
    const { formData } = this.state;
    const errors: ContactFormState['errors'] = {};

    if (!formData.name.trim()) {
      errors.name = 'Пожалуйста, введите ваше имя';
    }

    if (!formData.email.trim()) {
      errors.email = 'Пожалуйста, введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Неверный формат email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Пожалуйста, введите телефон';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Неверный формат телефона';
    }

    if (!formData.message.trim()) {
      errors.message = 'Пожалуйста, введите сообщение';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Сообщение должно содержать минимум 10 символов';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: undefined,
      },
    }));
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true });

    // Имитация отправки формы
    setTimeout(() => {
      console.log('Form submitted:', this.state.formData);
      this.setState({
        isSubmitting: false,
        submitSuccess: true,
        formData: {
          name: '',
          email: '',
          phone: '',
          message: '',
        },
      });

      setTimeout(() => {
        this.setState({ submitSuccess: false });
      }, 5000);
    }, 1500);
  };

  render() {
    const { formData, errors, isSubmitting, submitSuccess } = this.state;

    return (
      <section className={styles.contact} id="contact">
        <div className={styles.contact__container}>
          <div className={styles.contact__content}>
            <div className={styles.contact__info}>
              <h2 className={styles.contact__title}>Свяжитесь с нами</h2>
              <p className={styles.contact__description}>
                Заполните форму, и мы свяжемся с вами в ближайшее время для обсуждения вашего проекта
              </p>

              <div className={styles.contact__details}>
                <div className={styles.contact__detail}>
                  <div className={styles.contact__detail_icon}>📧</div>
                  <div className={styles.contact__detail_content}>
                    <h3 className={styles.contact__detail_title}>Email</h3>
                    <p className={styles.contact__detail_text}>
                      <a href="mailto:info@example.com">info@example.com</a>
                    </p>
                  </div>
                </div>

                <div className={styles.contact__detail}>
                  <div className={styles.contact__detail_icon}>📱</div>
                  <div className={styles.contact__detail_content}>
                    <h3 className={styles.contact__detail_title}>Телефон</h3>
                    <p className={styles.contact__detail_text}>
                      <a href="tel:+79001234567">+7 (900) 123-45-67</a>
                    </p>
                  </div>
                </div>

                <div className={styles.contact__detail}>
                  <div className={styles.contact__detail_icon}>📍</div>
                  <div className={styles.contact__detail_content}>
                    <h3 className={styles.contact__detail_title}>Адрес</h3>
                    <p className={styles.contact__detail_text}>г. Москва, ул. Примерная, д. 1</p>
                  </div>
                </div>
              </div>
            </div>

            <form className={styles.contact__form} onSubmit={this.handleSubmit}>
              {submitSuccess && (
                <div className={styles.contact__success}>
                  Спасибо! Ваше сообщение успешно отправлено!
                </div>
              )}

              <div className={styles.contact__form_group}>
                <label htmlFor="name" className={styles.contact__form_label}>
                  Имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={this.handleInputChange}
                  className={`${styles.contact__form_input} ${
                    errors.name ? styles['contact__form_input--error'] : ''
                  }`}
                  placeholder="Введите ваше имя"
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" className={styles.contact__form_error} role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className={styles.contact__form_group}>
                <label htmlFor="email" className={styles.contact__form_label}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={this.handleInputChange}
                  className={`${styles.contact__form_input} ${
                    errors.email ? styles['contact__form_input--error'] : ''
                  }`}
                  placeholder="example@mail.com"
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span id="email-error" className={styles.contact__form_error} role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.contact__form_group}>
                <label htmlFor="phone" className={styles.contact__form_label}>
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={this.handleInputChange}
                  className={`${styles.contact__form_input} ${
                    errors.phone ? styles['contact__form_input--error'] : ''
                  }`}
                  placeholder="+7 (900) 123-45-67"
                  autoComplete="tel"
                  required
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <span id="phone-error" className={styles.contact__form_error} role="alert">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className={styles.contact__form_group}>
                <label htmlFor="message" className={styles.contact__form_label}>
                  Сообщение *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={this.handleInputChange}
                  className={`${styles.contact__form_textarea} ${
                    errors.message ? styles['contact__form_textarea--error'] : ''
                  }`}
                  placeholder="Расскажите о вашем проекте..."
                  rows={5}
                  required
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <span id="message-error" className={styles.contact__form_error} role="alert">
                    {errors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.contact__form_button}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default ContactForm;
