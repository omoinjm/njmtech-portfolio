# Security Policy

## Overview

This document outlines how security vulnerabilities should be reported for the NJMTECH Portfolio project and describes our commitment to addressing security issues responsibly.

We take security seriously and appreciate the security research community's efforts to help us maintain a secure codebase.

---

## Reporting a Vulnerability

### ⚠️ **DO NOT** Open a Public GitHub Issue

**Please do NOT open a public GitHub issue to report a security vulnerability.** Public disclosure before a fix is available could put users at risk.

### 📧 Report Privately

If you discover a security vulnerability, please report it **privately** by sending an email to:

```
security@njmtech.vercel.app
```

Or use GitHub's private vulnerability reporting feature:
- Go to the [Security Tab](../../security/advisories/new) on the repository
- Click "Report a vulnerability"
- Follow the form to provide details

### 📋 What to Include in Your Report

Please provide as much detail as possible to help us understand and fix the issue:

1. **Type of vulnerability**
   - SQL Injection
   - Cross-Site Scripting (XSS)
   - Authentication/Authorization bypass
   - Sensitive data exposure
   - Dependency vulnerability
   - Infrastructure/deployment issue
   - Other (please describe)

2. **Location of the vulnerability**
   - File path(s) affected
   - Line numbers (if applicable)
   - URL or endpoint (if web-based)

3. **Description of the issue**
   - Clear explanation of what the vulnerability is
   - Why it's a security concern
   - Potential impact on users

4. **Proof of concept (PoC)**
   - Steps to reproduce the vulnerability
   - Code snippet or example (if applicable)
   - Screenshots (if applicable)
   - Detailed instructions for verification

5. **Environment details**
   - Node.js version you tested with
   - npm/pnpm version
   - Operating system
   - Browser (if web vulnerability)
   - Any other relevant environment info

6. **Affected version(s)**
   - Which version(s) of the project are affected?
   - Is it present in the latest code?

7. **Your contact information**
   - Your name/username
   - Your email address
   - Your GitHub username (optional but helpful)
   - PGP key (if you prefer encrypted communication)

---

## What Happens After You Report

### Timeline

1. **Acknowledgment (24-48 hours)**
   - You'll receive confirmation that we've received your report
   - We'll provide a reference number for tracking

2. **Assessment (3-7 days)**
   - We'll investigate and verify the vulnerability
   - We may ask follow-up questions if clarification is needed

3. **Fix Development (7-30 days)**
   - We'll develop and test a fix
   - Timeline depends on severity and complexity

4. **Disclosure Coordination (Ongoing)**
   - We'll keep you informed of progress
   - For critical issues, we may coordinate responsible disclosure
   - We may request a CVE ID if appropriate

5. **Release (Varies by severity)**
   - We'll release the fix as soon as it's ready
   - We may issue a security advisory
   - You'll be credited in the advisory (unless you prefer anonymity)

### Severity Levels

**Critical (0-3 days)**
- Remote code execution
- Authentication bypass
- Sensitive data exposure affecting all users
- Production database compromise

**High (3-7 days)**
- Privilege escalation
- Cross-site scripting affecting all users
- SQL injection with significant impact
- Credential exposure

**Medium (7-14 days)**
- Reflected XSS requiring user interaction
- CSRF with significant impact
- Dependency vulnerabilities with workarounds
- Information disclosure with limited impact

**Low (14-30 days)**
- Minor information disclosure
- Denial of service requiring specific conditions
- Dependency vulnerabilities with minimal impact
- Best practice improvements

---

## Security Best Practices for Users

### Environment Variables

Never commit `.env` files to version control:
- ✅ `.env` is in `.gitignore`
- ✅ Use `.env.example` for reference
- ✅ Set environment variables in Vercel dashboard
- ❌ Never hardcode secrets in code

### API Security

- Always use HTTPS for all communications
- Validate and sanitize all user inputs
- Use proper authentication tokens
- Implement rate limiting for API endpoints
- Follow OAuth 2.0 standards for authentication

### Database Security

- Use strong, unique passwords for database connections
- Enable SSL/TLS for database connections
- Use connection pooling (configured in this project)
- Implement proper access controls
- Regular backups with encryption

### Dependency Management

- Keep dependencies up to date
- Review security advisories regularly
- Use `npm audit` to check for vulnerabilities
- Remove unused dependencies
- Monitor for new vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (be careful, may break things)
npm audit fix --force
```

### Code Security

- Use TypeScript strict mode (enabled)
- Implement proper error handling
- Use CORS properly (origin-based, not wildcard)
- Implement input validation
- Use parameterized queries for database
- Enable security headers
- Use Content Security Policy (CSP)

---

## Supported Versions

Security updates are provided for:

| Version | Supported |
|---------|-----------|
| 0.5.x   | ✅ Yes    |
| 0.4.x   | ⚠️ Limited |
| 0.3.x   | ❌ No     |
| < 0.3   | ❌ No     |

We recommend always using the latest version.

---

## Known Security Considerations

### Current Security Status

✅ **Fixed:**
- CORS properly restricted to specific origin
- Environment variables protected in version control
- Input validation on API endpoints
- Proper error handling and HTTP status codes
- TypeScript strict mode enabled
- ESLint security rules enforced

⚠️ **To Address Before Production:**
- Rotate all exposed credentials (immediate action required)
- Update Vercel environment variables
- Implement email service with proper security
- Add rate limiting to API endpoints
- Implement request logging and monitoring

### Third-Party Dependencies

The project uses several third-party packages. Security of the project is dependent on:

- **Next.js** - Framework security
- **React** - UI library security
- **Bootstrap** - CSS framework (no security issues expected)
- **PostgreSQL** - Database security
- **Docker** - Container security
- **Vercel** - Hosting platform security

We monitor these dependencies for security advisories.

---

## Responsible Disclosure

We practice responsible disclosure:

1. **Private Report** - Security issues are reported privately
2. **Investigation** - We investigate and verify the issue
3. **Fix Development** - We develop and test a fix
4. **Notification** - We notify affected users/organizations
5. **Public Disclosure** - We publish a security advisory
6. **Credit** - We credit the researcher (with permission)

We ask reporters to:
- Give us reasonable time to fix the issue before disclosure
- Not disclose the vulnerability publicly until we've released a fix
- Not attempt to access data you're not authorized to access
- Not disrupt services or degrade user experience
- Not exploit the vulnerability for personal gain

---

## Security Contact

For security-related inquiries:

📧 **Email:** security@njmtech.vercel.app

📝 **GitHub Security Advisory:** [Report a Vulnerability](../../security/advisories/new)

🔒 **Encrypted Communication:** If you prefer PGP encryption, please request our public key

---

## Security Resources

### Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Top web vulnerabilities
- [CWE Top 25](https://cwe.mitre.org/top25/) - Top software weaknesses
- [npm Security](https://www.npmjs.com/advisories) - Dependency vulnerability database
- [Node.js Security](https://nodejs.org/en/docs/guides/security/) - Node.js security best practices

### Tools for Security Testing

- [npm audit](https://docs.npmjs.com/cli/audit) - Audit dependencies
- [Snyk](https://snyk.io/) - Dependency vulnerability scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Web app security testing
- [Burp Suite](https://portswigger.net/burp) - Security testing platform

### Security Headers

The project uses:
- ✅ CORS headers (origin-based)
- ✅ Content-Type headers
- ✅ X-Frame-Options (via Next.js)
- ✅ X-Content-Type-Options (via Next.js)

Recommended additions:
- [ ] Content-Security-Policy
- [ ] Strict-Transport-Security
- [ ] X-XSS-Protection
- [ ] Referrer-Policy

---

## Changelog

### Security Updates

#### Version 0.5.1 (Current)
- ✅ Fixed CORS configuration (wildcard → origin-based)
- ✅ Added request validation on API endpoints
- ✅ Implemented logging utility for security monitoring
- ✅ Added environment variable protection guidelines
- ✅ Created SECURITY.md policy

#### Version 0.5.0
- ✅ Implemented contact form validation
- ✅ Added error handling for API routes

#### Previous Versions
- See IMPROVEMENTS.md for full history

---

## Security Headers Configuration

### Current Configuration

```javascript
// next.config.js
async headers() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://njmtech.vercel.app';
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: origin },
        { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
        { key: 'Access-Control-Allow-Headers', value: '...' },
      ],
    },
  ];
}
```

### Recommended Additions

```javascript
// Add to next.config.js
{
  source: '/:path*',
  headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'Content-Security-Policy', value: "default-src 'self'" },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ],
}
```

---

## Compliance and Standards

This project follows:

- ✅ OWASP Top 10 prevention practices
- ✅ Node.js Security Guidelines
- ✅ TypeScript Strict Mode
- ✅ ESLint Security Rules
- ✅ Next.js Security Best Practices
- ✅ Industry Standard Code Organization

---

## Questions?

If you have questions about security (that don't involve reporting a vulnerability):

- 📖 Check the [README.md](./README.md)
- 📋 See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for recent changes
- 💬 Open a GitHub Discussion
- 📧 Contact us (non-security): contact@njmtech.vercel.app

For security vulnerabilities, **always use the private reporting channels** above.

---

## Thank You

Thank you for helping keep the NJMTECH Portfolio project secure! We appreciate your responsible disclosure and commitment to the security of our users.

---

**Last Updated:** December 17, 2024  
**Version:** 1.0  
**Status:** Active
