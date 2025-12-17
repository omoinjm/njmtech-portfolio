# NJMTECH Homepage

[https://njmtech.vercel.app/](https://njmtech.vercel.app/)

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or pnpm
- PostgreSQL database (or Neon PostgreSQL)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/njmtech-portfolio.git
cd njmtech-portfolio
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your actual configuration
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run sitemap` - Generate sitemap

## Project Structure

```
$PROJECT_ROOT
├── src/
│   ├── pages/                   # Next.js page routes
│   │   ├── api/                # API endpoints
│   │   └── *.tsx               # Page components
│   ├── framework/
│   │   ├── components/         # Reusable React components
│   │   ├── services/           # Business logic services
│   │   ├── utils/              # Utility functions
│   │   ├── models/             # TypeScript interfaces
│   │   ├── styles/             # Global styles
│   │   └── lib/                # Library code
│   └── tests/                  # Playwright E2E tests
├── public/                     # Static assets
├── node_modules/               # Dependencies
├── .husky/                     # Git hooks
├── .env.example               # Environment template
├── docker-compose.yml         # Local development setup
└── Dockerfile                 # Production Docker image
```

## Tech Stack

- **Frontend**: [Next.js 13](https://nextjs.org/) - React framework with SSR/SSG
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) + [Styled Components](https://styled-components.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with connection pooling
- **Testing**: [Playwright](https://playwright.dev/) for E2E testing
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Deployment**: [Vercel](https://vercel.com/)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://njmtech.vercel.app

# Email Configuration (for contact form)
NEXT_PUBLIC_EMAIL_MAIL=your-email@example.com
NEXT_PUBLIC_EMAIL_APP_PASS=your-app-specific-password
NEXT_PUBLIC_EMAIL_USER=your-email@example.com

# Mailchimp Newsletter Integration
NEXT_PUBLIC_MAILCHIMP_URL=https://your-mailchimp-list...

# Database Configuration (PostgreSQL)
POSTGRES_DATABASE=njmtech
POSTGRES_PASSWORD=your-secure-password
POSTGRES_HOST=your-database-host.aws.neon.tech
POSTGRES_USER=default
POSTGRES_URL=postgres://user:password@host/database?sslmode=require
```

**⚠️ SECURITY WARNING**: Never commit `.env.local` to Git. It's already in `.gitignore`. Use Vercel's environment variable management for production.

## Testing

### Run E2E Tests

Start the development server first:

```bash
npm run dev
```

In another terminal, run tests:

```bash
npx playwright test
```

View test reports:

```bash
npx playwright show-report
```

## Deployment

The project is configured to deploy to [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Docker Deployment

Build Docker image:

```bash
docker build -t njmtech-portfolio .
```

Run container:

```bash
docker run -p 3000:3000 \
  -e POSTGRES_URL="your-database-url" \
  njmtech-portfolio
```

## Best Practices

### Code Quality

- Code is automatically linted with ESLint
- Pre-commit hooks ensure code quality
- TypeScript provides type safety
- Prettier formats code automatically

### Security

- Use Vercel environment variable management for secrets
- Never commit `.env.local` to Git
- CORS is restricted to specific origins
- API endpoints have proper validation and error handling

### Performance

- Images optimized with Next.js Image component
- Lazy loading for components
- CSS-in-JS with styled-components for optimized styles
- Static generation (SSG) where possible

## Contributing

Feel free to fork this project and create your own portfolio. Please respect the license terms:

- Add a link to [my homepage](https://njmtech.vercel.app/)
- Do not use the 3D voxel dog

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

## Tutorial

Watch how I built this website on YouTube:

[![YouTube thumbnail](./doc/thumb.png)](https://www.youtube.com/watch?v=hYv6BM2fWd8)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
