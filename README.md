# Elysia 10x Backend

A high-performance, type-safe backend API built with [ElysiaJS](https://elysiajs.com/) and [Bun](https://bun.sh/). This project leverages modern tooling for a robust developer experience and production-ready features.

## 🚀 Features & Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime.
- **Framework**: [ElysiaJS](https://elysiajs.com/) - Ergonomic web framework for Bun.
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - Lightweight and type-safe ORM.
- **Authentication**: [Better Auth](https://www.better-auth.com/) - Comprehensive authentication library.
- **Validation**:
  - [Zod](https://zod.dev/) - TypeScript-first schema validation.
  - [TypeBox](https://github.com/sinclairzx81/typebox) - Super fast JSON schema validation (via Drizzle Typebox).
- **Documentation**: [OpenAPI / Swagger](https://elysiajs.com/plugins/openapi.html) (via `@elysiajs/openapi` and Scalar UI).
- **Logging**: [Pino](https://github.com/pinojs/pino) - High-performance logger.
- **Code Quality**:
  - **Linting**: [ESLint](https://eslint.org/) (Flat Config with TypeScript support).
  - **Formatting**: [Prettier](https://prettier.io/) (integrated with ESLint).
  - **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [Lint-staged](https://github.com/lint-staged/lint-staged).
  - **Commit Convention**: [Commitlint](https://commitlint.js.org/) (enforcing Conventional Commits).

## 🛠️ Prerequisites

- [Bun](https://bun.sh/) (v1.1 or later)
- PostgreSQL database

## 📦 Installation

```bash
# Install dependencies
bun install
```

## 🏃‍♂️ Development

```bash
# Start development server with hot reload
bun run dev
```

The API will be available at `http://localhost:4000`.

### Documentation
- **Swagger UI**: Visit `http://localhost:4000/docs` to view the interactive API documentation.

## 🗄️ Database

This project uses Drizzle ORM.

```bash
# Generate migrations
bun run db:generate

# Apply migrations
bun run db:migrate

# Open Drizzle Studio (Database GUI)
bun run db:studio
```

## 🧹 Code Quality

This project enforces code quality standards using ESLint, Prettier, and Git hooks.

### Linting & Formatting
```bash
# Check for linting errors
bun run lint

# Auto-fix linting errors
bun run lint:fix

# Format code
bun run format

# Check formatting
bun run format:check
```

### Git Hooks
- **Pre-commit**: Automatically runs `lint-staged` (linting and formatting) on staged files.
- **Commit-msg**: Validates commit messages using Conventional Commits (e.g., `feat: add user login`, `fix: database connection`).

## 📁 Project Structure

- `src/`
  - `config/` - Environment and app configuration.
  - `controllers/` - Request handlers.
  - `db/` - Database connection and schema definitions.
  - `lib/` - Shared libraries (e.g., auth, openapi).
  - `middleware/` - Elysia middleware.
  - `routes/` - API route definitions (using `@/` path alias).
  - `services/` - Business logic layer.
  - `utils/` - Utility functions and models.
- `.husky/` - Git hooks configuration.

## 📝 License

[MIT](LICENSE)
