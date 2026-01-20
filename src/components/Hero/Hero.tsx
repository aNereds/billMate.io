'use client';

import React, { Component } from 'react';
import styles from './Hero.module.scss';

interface HeroProps {}

interface HeroState {
  currentSlide: number;
}

class Hero extends Component<HeroProps, HeroState> {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: HeroProps) {
    super(props);
    this.state = {
      currentSlide: 0,
    };
  }

  componentDidMount() {
    this.startAutoSlide();
  }

  componentWillUnmount() {
    this.stopAutoSlide();
  }

  startAutoSlide = () => {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  };

  stopAutoSlide = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  };

  nextSlide = () => {
    this.setState((prevState) => ({
      currentSlide: (prevState.currentSlide + 1) % 3,
    }));
  };

  setSlide = (index: number) => {
    this.setState({ currentSlide: index });
    this.stopAutoSlide();
    this.startAutoSlide();
  };

  render() {
    const { currentSlide } = this.state;

    const slides = [
      {
        title: 'Современные веб-решения',
        subtitle: 'Создаем приложения нового поколения',
        description: 'Используем передовые технологии для реализации ваших идей',
      },
      {
        title: 'Быстрая разработка',
        subtitle: 'От идеи до релиза',
        description: 'Эффективные процессы разработки и deployment',
      },
      {
        title: 'Качество и надежность',
        subtitle: 'Проверенные решения',
        description: 'Тестирование и поддержка на всех этапах',
      },
    ];

    return (
      <section className={styles.hero} id="hero">
        <div className={styles.hero__container}>
          <div className={styles.hero__content}>
            <h1 className={styles.hero__title}>
              {slides[currentSlide].title}
            </h1>
            <p className={styles.hero__subtitle}>
              {slides[currentSlide].subtitle}
            </p>
            <p className={styles.hero__description}>
              {slides[currentSlide].description}
            </p>
            <div className={styles.hero__actions}>
              <button className={`${styles.hero__button} ${styles['hero__button--primary']}`}>
                Начать проект
              </button>
              <button className={`${styles.hero__button} ${styles['hero__button--secondary']}`}>
                Узнать больше
              </button>
            </div>
          </div>

          <div className={styles.hero__indicators}>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`${styles.hero__indicator} ${
                  index === currentSlide ? styles['hero__indicator--active'] : ''
                }`}
                onClick={() => this.setSlide(index)}
                aria-label={`Слайд ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default Hero;
