# Purrfect Market

React (FE) + Spring Boot (BE) application.

![Purrfect Market homepage](docs/screenshot.png)

## Run in browser

### Frontend (FE)

```bash
cd Frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — landing page. Products: [http://localhost:5173/products](http://localhost:5173/products).

### Backend (BE) — optional

```bash
cd Backend
mvn spring-boot:run
```

API: [http://localhost:8080/api/hello](http://localhost:8080/api/hello)

### Auth (session-based)

- **Login**: `POST /api/auth/login` (email, password)
- **Register**: `POST /api/auth/register` (name, email, password)
- **Logout**: `POST /api/auth/logout`
- **Current user**: `GET /api/auth/me`

Test user: `test@purrfect.com` / `password`

### Add Product (API)

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Product Name","description":"Description","price":19.99,"category":"Toys","imageUrl":"https://example.com/image.jpg","rating":4.8,"reviewCount":50,"badge":null}'
```

### Database (H2)

- File-based at `Backend/data/purrfect.mv.db` (persists across restarts)
- H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:file:./data/purrfect`)

### Stripe Payments (test mode)

Checkout uses Stripe in **test mode** — no real charges. Setup:

1. Create a free Stripe account at [stripe.com](https://stripe.com).
2. In the [Stripe Dashboard](https://dashboard.stripe.com), enable **Developers → API keys** and copy the **Secret key** (starts with `sk_test_`).
3. Set the key before starting the backend:

   ```bash
   cd Backend
   export STRIPE_API_KEY=sk_test_your_key_here
   mvn spring-boot:run
   ```

   Or add to `Backend/src/main/resources/application.properties`:

   ```
   stripe.api.key=sk_test_your_key_here
   ```

4. When you click **Proceed to payment**, you’ll be redirected to Stripe Checkout.
5. Use Stripe test cards, e.g. `4242 4242 4242 4242`, any future expiry, any CVC. See [Stripe test cards](https://stripe.com/docs/testing#cards).
