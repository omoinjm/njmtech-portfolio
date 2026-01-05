# Project Overview

This is a Next.js project that serves as a personal portfolio. It's built with TypeScript, React, and styled-components. The backend is powered by Next.js API routes and a PostgreSQL database. The project also includes end-to-end tests written with Playwright.

### Building and Running

**Dependencies:**

- Node.js (v22.x or higher)
- pnpm

**Installation:**

```bash
pnpm install
```

**Running the development server:**

```bash
pnpm dev
```

**Building for production:**

```bash
pnpm build
```

**Running tests:**

```bash
pnpm playwright test
```

### Development Conventions

- **Styling:** The project uses `styled-components` for CSS-in-JS styling, along with `react-bootstrap` for UI components.
- **Data Fetching:** A `DataService` class is used to make API calls to the backend.
- **Type Safety:** The project is written in TypeScript, and data models are defined in the `src/framework/models` directory.
- **Code Quality:** ESLint and Prettier are used for code linting and formatting. Husky is used to run pre-commit hooks.
- **Testing:** End-to-end tests are written with Playwright and are located in the `src/tests` directory.
- **SEO:** The project uses `next-sitemap` to generate a sitemap and includes SEO-related configurations in `next.config.js`.

### Key Files

- `next.config.js`: Next.js configuration, including image optimization, styled-components, and custom headers.
- `package.json`: Project dependencies and scripts.
- `src/framework/styles/globals.css`: Global CSS styles.
- `src/pages/`: Next.js pages, which define the routes of the application.
- `src/framework/components/`: Reusable React components.
- `src/framework/services/`: Business logic and data fetching services.
- `src/framework/models/`: TypeScript interfaces for data models.
- `src/tests/`: End-to-end tests written with Playwright.
- `README.md`: Detailed project documentation.
