# Purrfect Market — Tech Stack

## Frontend
- **React** + **TypeScript** (Vite)
- **styled-components** — styling + dark mode theming
- **React Router** — client-side routing

## Backend
- **Java 21** + **Spring Boot 3.4**
- **Spring Security** — session-based authentication (dual filter chains: public + authenticated)
- **Spring Data JPA** + **Hibernate**
- **H2** — file-based database (local dev)

## Payments
- **Stripe** — hosted Checkout Sessions (test mode)
  - Backend creates session, user pays on Stripe's page, backend verifies on return

## Email
- **Resend** — transactional email
  - Used for: signup welcome, review submission notifications, newsletter broadcasts

## Storage
- **GitHub** — source code (`github.com/Dom119/purrfect-market`)

## Testing
- **Playwright** — end-to-end browser testing
- **JUnit** + **Spring Boot Test** — backend unit and integration tests

## Dev Tools
- **Maven** — backend build
- **npm** — frontend package manager
- **H2 Console** — database browser (`http://localhost:8080/h2-console`)
