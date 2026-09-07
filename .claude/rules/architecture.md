# Purrfect Market — Architecture

## Overview

Full-stack monorepo: a React SPA (Vite) talking to a Spring Boot REST API over HTTP.

**Dev**: Vite proxies `/api/*` to `localhost:8080`. Backend uses H2 file DB locally.

**Production**: Frontend on Vercel, backend on Railway. Vercel rewrites `/api/*` to the Railway backend URL — browser sees one origin so session cookies and auth work without CORS changes. Database is Railway managed PostgreSQL.

```
Dev
  Browser
    └── React SPA (localhost:5173)
          └── /api/*  ──proxy──►  Spring Boot (localhost:8080)
                                        ├── H2 File DB
                                        ├── Stripe API
                                        └── Resend API

Production
  Browser
    └── React SPA (Vercel)
          └── /api/*  ──rewrite──►  Spring Boot (Railway)
                                          ├── PostgreSQL (Railway)
                                          ├── Stripe API
                                          └── Resend API
```

---

## Frontend

### Entry Point
`src/main.tsx` → `App.tsx` (BrowserRouter + providers + routes)

### State / Context
| Context | Responsibility |
|---|---|
| `ColorThemeProvider` | Light/dark theme toggle |
| `FavoritesProvider` | Favorite product IDs, synced to backend |
| `CartProvider` | Cart items, add/update/remove, toast notifications |

### Pages
| Route | Page |
|---|---|
| `/` | LandingPage |
| `/products` / `/products/:id` | ProductsPage (with ProductDetailModal) |
| `/favorites` | FavoritesPage |
| `/cart` | CartPage (Stripe checkout + order confirmation) |
| `/orders` | OrdersPage |
| `/account` | AccountPage |
| `/blog`, `/about`, `/faq`, etc. | Static content pages |
| `/admin/*` | Admin panel (MAIN_ADMIN only) |

### Admin Pages
| Route | Page |
|---|---|
| `/admin/dashboard` | Stats overview |
| `/admin/orders` | Order management + CSV export |
| `/admin/products` | Product CRUD + inventory |
| `/admin/users` | User group management + emulation |
| `/admin/subscribers` | Newsletter subscribers |
| `/admin/newsletter` | Broadcast composer + history |
| `/admin/reviews` | Approve / reject pending reviews |

### Key Components
- `Header` — nav, auth modal trigger, cart/favorites counts
- `ProductDetailModal` — product detail, qty stepper, reviews modal trigger
- `ReviewsModal` — public reviews list + authenticated submit form
- `CartToast` — slide-in notification on cart add/update
- `EmulationBar` — shown when admin is emulating a user

### API Layer (`src/api/`)
Each file wraps `fetch` calls for a domain: `auth`, `cart`, `favorites`, `orders`, `products`, `newsletter`, `admin`.

---

## Backend

### Package Structure
```
com.purrfectmarket
├── config/          # Security, Stripe config, DB seeders
├── controller/      # REST endpoints
├── dto/             # Request/response records
├── exception/       # Global exception handler
├── model/           # JPA entities
├── repository/      # Spring Data JPA interfaces
├── service/         # Business logic
└── util/            # Helpers
```

### Security (Spring Security)
Two filter chains:
- **Public chain** — `/api/products/**`, `/api/auth/**`, `/api/newsletter/**`, `/api/contact` — no auth required
- **Authenticated chain** — everything else (`/api/reviews/**`, `/api/cart/**`, `/api/favorites/**`, `/api/orders/**`, `/api/admin/**`) — session cookie required

Admin endpoints additionally check `userGroup == MAIN_ADMIN`.

### Controllers
| Controller | Endpoints |
|---|---|
| `AuthController` | POST /auth/register, /auth/login, /auth/logout, GET /auth/me |
| `ProductController` | GET /products, /products/{id} |
| `ReviewController` | GET /products/{id}/reviews |
| `UserReviewController` | POST /reviews/{productId} |
| `CartController` | GET/POST/PATCH/DELETE /cart, POST /cart/checkout, GET /cart/checkout/complete |
| `FavoriteController` | GET/POST/DELETE /favorites |
| `OrderController` | GET /orders |
| `NewsletterController` | POST /newsletter/subscribe, /newsletter/unsubscribe |
| `ContactController` | POST /contact |
| `AdminStatsController` | GET /admin/stats |
| `AdminOrderController` | GET /admin/orders, /admin/orders/export.csv |
| `AdminProductController` | GET/POST/PUT/DELETE /admin/products, PATCH /admin/products/{id}/inventory |
| `AdminUserController` | GET /admin/users, PATCH /admin/users/{id}/group |
| `AdminEmulationController` | POST /admin/emulate/{userId}, DELETE /admin/emulate |
| `AdminNewsletterController` | POST /admin/newsletter/broadcast, GET /admin/newsletter/history |
| `AdminReviewController` | GET /admin/reviews/pending, POST /admin/reviews/{id}/approve, DELETE /admin/reviews/{id} |

### Data Models (JPA Entities)
| Entity | Description |
|---|---|
| `User` | Auth credentials, name, userGroup (USER / MAIN_ADMIN) |
| `Product` | Name, price, category, image, rating, reviewCount, stock |
| `Review` | Published review linked to product |
| `PendingReview` | Submitted review awaiting admin approval |
| `Order` + `OrderItem` | Customer order with line items |
| `CartItem` | Per-user cart entries |
| `Favorite` | Per-user favorited products |
| `NewsletterSubscriber` | Email subscribers |
| `NewsletterBroadcastLog` | Sent newsletter history |

### Database Seeders (`config/`, run on startup if table empty)
| Seeder | Order | Seeds |
|---|---|---|
| `ProductSeeder` | 1 | 9 products with images, ratings, categories |
| `ReviewSeeder` | 2 | 10–12 published reviews per product |
| `PendingReviewSeeder` | 3 | 6 fake pending reviews for admin testing |

### Key Flows

**Checkout (Stripe)**
1. `POST /cart/checkout` → `StripeService.createCheckoutSession()` → returns Stripe-hosted URL
2. User pays on Stripe's page
3. Stripe redirects to `/cart?session_id=...`
4. `GET /cart/checkout/complete?session_id=...` → verifies payment via Stripe API → creates Order in DB

**Review Submission**
1. Logged-in user submits review via `POST /reviews/{productId}`
2. `ReviewSubmissionService` checks user purchased the product via `OrderRepository`
3. Saves `PendingReview` to DB + emails all MAIN_ADMIN via Resend
4. Admin approves via `POST /admin/reviews/{id}/approve` → publishes as `Review` + recalculates product rating

**User Emulation**
1. Admin clicks emulate on a user → `POST /admin/emulate/{userId}` → swaps session to target user, stores original admin in session
2. `EmulationBar` appears in UI
3. Stop emulation → `DELETE /admin/emulate` → restores original admin session
