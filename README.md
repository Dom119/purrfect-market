# Purrfect Market

React (FE) + Spring Boot (BE) application.

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
