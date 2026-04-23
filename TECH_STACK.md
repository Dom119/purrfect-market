# Purrfect Market — Tech Stack

## Frontend
- **React** + **TypeScript** (Vite)
- **styled-components** — styling + dark mode theming
- **React Router** — client-side routing

## Backend
- **Java 21** + **Spring Boot 3.4**
- **Spring Security** — session-based authentication (dual filter chains: public + authenticated)
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL** — production database (Railway managed)
- **H2** — file-based database (local dev only)

## Payments
- **Stripe** — hosted Checkout Sessions
  - Backend creates session, user pays on Stripe's page, backend verifies on return

## Email
- **Resend** — transactional email
  - Used for: signup welcome, review submission notifications, newsletter broadcasts

## Hosting
- **Vercel** — frontend (React SPA, static)
- **Railway** — backend (Spring Boot) + managed PostgreSQL

## Storage
- **GitHub** — source code (`github.com/Dom119/purrfect-market`)

## Testing
- **Playwright** — end-to-end browser testing
- **JUnit** + **Spring Boot Test** — backend unit and integration tests

## Dev Tools
- **Maven** — backend build
- **npm** — frontend package manager
- **H2 Console** — database browser in dev (`http://localhost:8080/h2-console`)
