# Contributing to NJMTECH Portfolio

First, thank you for considering contributing to the NJMTECH Portfolio project! We appreciate your interest in helping make this project better.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. We're committed to providing a welcoming environment for all contributors.

## Ways to Contribute

### 1. Report Bugs
- **Security Issues:** See [SECURITY.md](./SECURITY.md)
- **Other Bugs:** Open a GitHub issue with detailed information
  - Clear description of the bug
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots (if applicable)
  - Environment details (Node version, OS, browser)

### 2. Suggest Enhancements
- Open a GitHub issue with the `enhancement` label
- Describe the feature clearly
- Explain the use case
- Provide examples if applicable

### 3. Submit Pull Requests
- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request with clear description

### 4. Improve Documentation
- Fix typos
- Clarify confusing sections
- Add examples
- Update outdated information

### 5. Security Improvements
- Report vulnerabilities privately (see SECURITY.md)
- Suggest security enhancements
- Implement security best practices

## Getting Started

### Prerequisites
- Node.js 22.x or higher
- npm or pnpm
- PostgreSQL (for local development)
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/njmtech-portfolio.git
cd njmtech-portfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your local values

# Start development server
npm run dev
```

### Docker Setup

```bash
# Using Docker Compose
docker-compose up

# Or build Docker image
docker build -t njmtech-portfolio .
docker run -p 3000:3000 njmtech-portfolio
```

## Development Guidelines

### Code Style

- Follow existing code style
- Use TypeScript for new code
- Enable TypeScript strict mode
- Run ESLint: `npm run lint`
- Run Prettier: automatically via pre-commit hooks

### Quality Standards

```bash
# Before submitting:
npm run type-check    # TypeScript validation
npm run lint          # ESLint validation
npm run build         # Production build
npm run test          # Tests (if added)
```

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add new feature description
fix: fix bug description
docs: update documentation
refactor: refactor code section
test: add or update tests
chore: maintenance tasks
perf: performance improvements
security: security fixes or improvements
```

Example:
```
feat: add rate limiting to contact API endpoint

- Implement express-rate-limit middleware
- Set to 5 requests per minute per IP
- Add rate limit headers to response
- Document rate limiting in API docs

Closes #123
```

### Testing

- Write tests for new features
- Update tests when fixing bugs
- Ensure all tests pass: `npm run test`
- Run E2E tests: `npx playwright test`

```bash
# Run tests
npm run test

# Run E2E tests
npx playwright test

# View test report
npx playwright show-report
```

### Documentation

- Update README.md if adding new features
- Document API changes
- Include JSDoc comments for functions
- Add examples for complex functionality

```typescript
/**
 * Fetches user data from the API
 * @param userId - The user's unique identifier
 * @returns Promise<User> - User data object
 * @throws Error if user not found
 * @example
 * const user = await fetchUser('123');
 */
export async function fetchUser(userId: string): Promise<User> {
  // Implementation
}
```

## Security Guidelines for Contributors

### Secret Management
- ❌ Never commit secrets to the repository
- ❌ Never hardcode credentials in code
- ✅ Use environment variables for secrets
- ✅ Keep .env.local in .gitignore
- ✅ Use .env.example as reference template

### Input Validation
- ✅ Validate all user inputs
- ✅ Sanitize data before using in queries
- ✅ Use parameterized queries for database
- ❌ Don't trust user input

### Dependencies
- ✅ Keep dependencies updated
- ✅ Run `npm audit` regularly
- ✅ Use `npm audit fix` for vulnerabilities
- ❌ Don't add unnecessary dependencies
- ❌ Review dependency licenses

### Code Security
- ✅ Use TypeScript strict mode
- ✅ Enable ESLint security rules
- ✅ Implement proper error handling
- ✅ Log security-relevant events
- ❌ Don't expose sensitive information in logs
- ❌ Don't disable security features

### API Security
- ✅ Implement input validation
- ✅ Use proper HTTP status codes
- ✅ Implement rate limiting
- ✅ Use CORS properly (origin-based)
- ❌ Don't enable wildcard CORS
- ❌ Don't expose internal errors to users

See [SECURITY.md](./SECURITY.md) for detailed security policy.

## Pull Request Process

1. **Update** README.md or SECURITY.md if needed
2. **Test** your changes thoroughly
3. **Run** quality checks:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```
4. **Create** a clear pull request description
5. **Link** related issues
6. **Wait** for review and feedback
7. **Address** any requested changes

### PR Title Format

```
type(scope): description

feat(api): add rate limiting to contact endpoint
fix(components): fix button alignment issue
docs(readme): update installation steps
refactor(utils): simplify logger utility
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested on local environment
- [ ] Tests added/updated
- [ ] Build passes
- [ ] Linting passes

## Security Considerations
- [ ] No secrets exposed
- [ ] Input validated
- [ ] No dependency vulnerabilities
- [ ] Error handling proper

## Checklist
- [ ] Code follows style guidelines
- [ ] Changes documented
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Project Structure

```
src/
├── pages/          # Next.js page routes
│   ├── api/       # API endpoints
│   └── *.tsx      # Page components
├── framework/      # Application logic
│   ├── components/
│   ├── services/
│   ├── utils/
│   ├── models/
│   ├── styles/
│   └── lib/
└── tests/         # E2E tests
```

## Naming Conventions

### Files and Folders
- Components: `PascalCase` (e.g., `Hero.tsx`)
- Files: `kebab-case` or `camelCase` (e.g., `data.service.ts`)
- Folders: `kebab-case` (e.g., `components/`, `api/`)

### Variables and Functions
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`
- Classes: `PascalCase`
- Interfaces: `PascalCase` with optional `I` prefix

### CSS Classes
- Follow BEM or Utility-first approach
- Use descriptive names
- Keep specificity low

## Useful Links

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Getting Help

- 📖 Check [README.md](./README.md)
- 📋 See [IMPROVEMENTS.md](./IMPROVEMENTS.md)
- 🔒 Security issues? See [SECURITY.md](./SECURITY.md)
- 💬 Open a GitHub Discussion
- 📧 Email: contact@njmtech.vercel.app

## Licensing

By contributing, you agree that your contributions will be licensed under the MIT License (see LICENSE file).

## Recognition

We recognize and appreciate all contributions! Contributors will be:
- Added to the project's contributor list
- Mentioned in release notes (if substantial)
- Credited in documentation

## Questions?

Feel free to:
1. Check existing documentation
2. Open a GitHub Discussion
3. Email us at contact@njmtech.vercel.app

Thank you for contributing to make NJMTECH Portfolio better! 🚀

---

## Additional Resources

### Development
- [Next.js Best Practices](https://nextjs.org/docs/going-to-production)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [React Best Practices](https://react.dev/learn)

### Testing
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [npm Security Advisories](https://www.npmjs.com/advisories)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**Last Updated:** December 17, 2024  
**Version:** 1.0
