'use client';

import React, { Component } from 'react';
import styles from './Features.module.scss';

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {}

interface FeaturesState {
  features: Feature[];
}

class Features extends Component<FeaturesProps, FeaturesState> {
  constructor(props: FeaturesProps) {
    super(props);
    this.state = {
      features: [
        {
          id: 1,
          icon: '⚡',
          title: 'Высокая производительность',
          description: 'Оптимизированный код и быстрая загрузка страниц для лучшего пользовательского опыта',
        },
        {
          id: 2,
          icon: '🎨',
          title: 'Современный дизайн',
          description: 'Адаптивный интерфейс, который выглядит превосходно на любых устройствах',
        },
        {
          id: 3,
          icon: '🔒',
          title: 'Безопасность',
          description: 'Защита данных и современные практики безопасности на всех уровнях',
        },
        {
          id: 4,
          icon: '📱',
          title: 'Мобильная адаптация',
          description: 'Идеальная работа на смартфонах и планшетах любых размеров',
        },
        {
          id: 5,
          icon: '🚀',
          title: 'SEO оптимизация',
          description: 'Высокие позиции в поисковых системах благодаря современным техникам',
        },
        {
          id: 6,
          icon: '💡',
          title: 'Инновации',
          description: 'Использование передовых технологий и лучших практик разработки',
        },
      ],
    };
  }

  render() {
    const { features } = this.state;

    return (
      <section className={styles.features} id="features">
        <div className={styles.features__container}>
          <div className={styles.features__header}>
            <h2 className={styles.features__title}>Наши возможности</h2>
            <p className={styles.features__subtitle}>
              Все необходимое для создания современного веб-приложения
            </p>
          </div>

          <div className={styles.features__grid}>
            {features.map((feature) => (
              <div key={feature.id} className={styles.features__card}>
                <div className={styles.features__card_icon}>{feature.icon}</div>
                <h3 className={styles.features__card_title}>{feature.title}</h3>
                <p className={styles.features__card_description}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default Features;
