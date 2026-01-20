'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import styles from './Breadcrumbs.module.scss';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

class Breadcrumbs extends Component<BreadcrumbsProps> {
  render() {
    const { items } = this.props;

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbs__list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className={styles.breadcrumbs__item}>
                {isLast ? (
                  <span className={styles.breadcrumbs__current} aria-current="page">
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link href={item.href} className={styles.breadcrumbs__link}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.breadcrumbs__link}>{item.label}</span>
                )}
                {!isLast && (
                  <span className={styles.breadcrumbs__separator} aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
}

export default Breadcrumbs;
