'use client';

import React, { Component } from 'react';
import styles from './Services.module.scss';

interface Service {
  id: number;
  category: 'web' | 'mobile' | 'design';
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

interface ServicesProps {}

interface ServicesState {
  services: Service[];
  selectedCategory: 'all' | 'web' | 'mobile' | 'design';
}

class Services extends Component<ServicesProps, ServicesState> {
  constructor(props: ServicesProps) {
    super(props);
    this.state = {
      selectedCategory: 'all',
      services: [
        {
          id: 1,
          category: 'web',
          title: 'Веб-разработка',
          description: 'Создание современных веб-приложений с использованием React, Next.js и TypeScript',
          price: 'от 100 000 ₽',
          features: [
            'Адаптивный дизайн',
            'SEO оптимизация',
            'Высокая производительность',
            'Современный стек технологий',
          ],
        },
        {
          id: 2,
          category: 'mobile',
          title: 'Мобильная разработка',
          description: 'Разработка кроссплатформенных мобильных приложений для iOS и Android',
          price: 'от 150 000 ₽',
          features: [
            'React Native',
            'Native производительность',
            'Push-уведомления',
            'Офлайн режим',
          ],
          isPopular: true,
        },
        {
          id: 3,
          category: 'design',
          title: 'UI/UX Дизайн',
          description: 'Проектирование пользовательских интерфейсов с фокусом на удобство и эстетику',
          price: 'от 50 000 ₽',
          features: [
            'Исследование пользователей',
            'Прототипирование',
            'Дизайн-система',
            'Тестирование юзабилити',
          ],
        },
      ],
    };
  }

  handleCategoryChange = (category: 'all' | 'web' | 'mobile' | 'design') => {
    this.setState({ selectedCategory: category });
  };

  render() {
    const { services, selectedCategory } = this.state;
    const filteredServices =
      selectedCategory === 'all'
        ? services
        : services.filter((service) => service.category === selectedCategory);

    return (
      <section className={styles.services} id="services">
        <div className={styles.services__container}>
          <div className={styles.services__header}>
            <h2 className={styles.services__title}>Наши услуги</h2>
            <p className={styles.services__subtitle}>
              Выберите подходящее решение для вашего бизнеса
            </p>
          </div>

          <div className={styles.services__filters}>
            <button
              className={`${styles.services__filter} ${
                selectedCategory === 'all' ? styles['services__filter--active'] : ''
              }`}
              onClick={() => this.handleCategoryChange('all')}
            >
              Все услуги
            </button>
            <button
              className={`${styles.services__filter} ${
                selectedCategory === 'web' ? styles['services__filter--active'] : ''
              }`}
              onClick={() => this.handleCategoryChange('web')}
            >
              Веб
            </button>
            <button
              className={`${styles.services__filter} ${
                selectedCategory === 'mobile' ? styles['services__filter--active'] : ''
              }`}
              onClick={() => this.handleCategoryChange('mobile')}
            >
              Мобильные
            </button>
            <button
              className={`${styles.services__filter} ${
                selectedCategory === 'design' ? styles['services__filter--active'] : ''
              }`}
              onClick={() => this.handleCategoryChange('design')}
            >
              Дизайн
            </button>
          </div>

          <div className={styles.services__grid}>
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`${styles.services__card} ${
                  service.isPopular ? styles['services__card--popular'] : ''
                }`}
              >
                {service.isPopular && (
                  <div className={styles.services__card_badge}>Популярное</div>
                )}
                <h3 className={styles.services__card_title}>{service.title}</h3>
                <p className={styles.services__card_description}>{service.description}</p>
                <div className={styles.services__card_price}>{service.price}</div>
                <ul className={styles.services__card_features}>
                  {service.features.map((feature, index) => (
                    <li key={index} className={styles.services__card_feature}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <button className={styles.services__card_button}>Заказать</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default Services;
