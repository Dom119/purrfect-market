# Purrfect Market — Project Conventions

> **Purpose**: Reference for AI and developers. Follow these conventions when working on this project.

---

## Architecture

- **Frontend (FE)**: Modern React application — `Frontend/` folder
- **Backend (BE)**: Spring Boot application — `Backend/` folder
- **Integration**: FE and BE communicate via REST APIs

---

## Frontend (FE)

| Aspect | Convention |
|--------|------------|
| **Framework** | React (modern, functional components) |
| **Language** | TypeScript |
| **Styling** | Styled Components |
| **API** | Consume BE REST APIs |

### Best Practices

- Use functional components and hooks
- Prefer TypeScript strict mode
- Colocate styles with components using Styled Components
- Extract reusable logic into custom hooks
- Use proper typing for API responses and props

---

## Backend (BE)

| Aspect | Convention |
|--------|------------|
| **Framework** | Spring Boot |
| **Language** | Java (latest LTS or version used in the codebase) |
| **API** | Expose REST APIs for FE consumption |

### Best Practices

- Follow Spring Boot conventions and project structure
- Use DTOs for API request/response
- Apply proper exception handling and HTTP status codes
- Keep controllers thin; put business logic in services
- Use dependency injection and avoid tight coupling

---

## General

- Follow coding best practices for React/TypeScript and Spring Boot/Java
- Maintain clear separation between FE and BE
- Keep API contracts consistent and well-defined
