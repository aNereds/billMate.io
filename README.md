# BillMate.io - Factoring Platform

Modern factoring platform built with Next.js, React class components, and BEM methodology.

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app` - Next.js pages (App Router)
- `src/components` - React class components with BEM styling
- `src/styles` - Global styles, variables, and mixins
- `src/utils` - Utility functions (auth, storage)
- `src/data` - Mock data

## Features

- **Landing Page** - Homepage with features and services
- **Onboarding** - 4-step registration process
- **Dashboard** - Invoice and debtor management
- **Admin Panel** - Client, invoice, and payout management
- **LocalStorage** - Data persistence with sample data protection
- **Authentication** - Login/signup with localStorage

## Routes

- `/` - Landing page
- `/onboarding` - Registration process
- `/dashboard` - Main dashboard (requires authentication)
- `/admin` - Admin panel (requires authentication)

## Technologies

- Next.js 14
- React 18 (Class Components)
- TypeScript
- SCSS with BEM methodology
- LocalStorage for data persistence
