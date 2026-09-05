---
paths:
  - "Backend/**"
---

# Java + Spring Boot Best Practices

Stack in this project: Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA, PostgreSQL/H2, Stripe.

## Layering

- Controller → Service → Repository. Controllers stay thin: request/response mapping and validation only, no business logic.
- Never expose JPA `@Entity` classes directly in a controller response or request body — map to/from a DTO (record) at the boundary.
- Put mapping logic in a dedicated mapper (method or small class), not inline in the controller.

## DTOs & Validation

- Use Java `record`s for request/response DTOs.
- Validate incoming DTOs with Bean Validation annotations (`@NotNull`, `@Size`, `@Email`, etc.) and `@Valid` on the controller parameter — don't hand-roll null checks for things validation already covers.

## REST Design

- Resource URLs are plural nouns (`/api/products`, not `/api/getProduct`); HTTP verbs carry the action.
- Return correct status codes (`201` on create with `Location` header, `204` on delete, `404` vs `400` distinguished correctly).
- Version breaking changes rather than silently changing an existing endpoint's shape.

## Error Handling

- Centralize exception-to-response mapping in a `@RestControllerAdvice` — don't try/catch the same error shape in every controller method.
- Throw specific exceptions (or custom ones) rather than returning nulls or generic `RuntimeException`.

## Persistence

- Keep query logic in the repository layer (`@Query` / derived method names), not scattered `EntityManager` calls in services.
- Watch for N+1 queries on associations — use fetch joins or `@EntityGraph` when a list endpoint pulls related entities.
- Wrap multi-step writes that must succeed or fail together in `@Transactional` at the service layer.

## Security

- Never log or return secrets, tokens, or full card/payment details (Stripe integration) in responses or logs.
- New endpoints must have explicit authorization rules in `SecurityConfig` — don't rely on defaults permitting access.

## Testing

- See [backend-unit-tests.md](backend-unit-tests.md) — new service/controller logic needs tests, and `mvn test` must pass before considering the change done.
