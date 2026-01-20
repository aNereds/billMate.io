'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Error.module.scss';

export default function ErrorPage() {
  return (
    <div className={styles.error}>
      <div className={styles.error__container}>
        <div className={styles.error__content}>
          <h1 className={styles.error__title}>Oops!</h1>
          <h2 className={styles.error__subtitle}>Something went wrong</h2>
          <p className={styles.error__message}>
            Contact our company to fix this issue
          </p>
          <div className={styles.error__actions}>
            <Link href="/dashboard" className={styles.error__button}>
              Back to Dashboard
            </Link>
            <Link href="/" className={styles.error__button_secondary}>
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
