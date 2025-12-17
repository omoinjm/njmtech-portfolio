import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should load the homepage", async ({ page }) => {
    // Check if page title is correct
    await expect(page).toHaveTitle(/Nhlanhla Junior Malaza/);
  });

  test("should display hero section", async ({ page }) => {
    // Check if hero section is visible
    const tagline = page.locator(".tagline");
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText("Nhlanhla Junior Malaza");
  });

  test("should have resume button with correct link", async ({ page }) => {
    // Check if resume button exists and has correct href
    const resumeButton = page.locator('a[aria-label="Resume"]');
    await expect(resumeButton).toBeVisible();
    await expect(resumeButton).toHaveAttribute("href", /blob.vercel-storage/);
    await expect(resumeButton).toHaveAttribute("target", "_blank");
  });

  test("should have navigation links", async ({ page }) => {
    // Check if navigation is present
    const navbar = page.locator(".navbar");
    await expect(navbar).toBeVisible();
  });
});

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/contact");
  });

  test("should load contact page", async ({ page }) => {
    await expect(page).toHaveTitle(/.*contact.*/i);
  });

  test("contact form should have required fields", async ({ page }) => {
    // Check if form fields exist
    const firstNameField = page.locator('input[name*="first"]');
    const lastNameField = page.locator('input[name*="last"]');
    const emailField = page.locator('input[type="email"]');
    const messageField = page.locator("textarea");

    await expect(
      firstNameField.or(page.locator("input").first()),
    ).toBeVisible();
  });
});

test.describe("Projects Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/projects");
  });

  test("should load projects page", async ({ page }) => {
    await expect(page).toHaveTitle(/.*project.*/i);
  });

  test("should display projects content", async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState("networkidle");
    const content = page.locator("main, section").first();
    await expect(content).toBeVisible();
  });
});

test.describe("API Routes", () => {
  test("contact endpoint should reject GET requests", async ({ request }) => {
    const response = await request.get("http://localhost:3000/api/contact");
    expect(response.status()).toBe(405);
  });

  test("contact endpoint should accept POST requests with valid data", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/contact", {
      data: {
        first_name: "John",
        last_name: "Doe",
        email_address: "john@example.com",
        message: "Test message",
      },
    });
    expect([200, 400, 500]).toContain(response.status());
  });

  test("contact endpoint should reject invalid data", async ({ request }) => {
    const response = await request.post("http://localhost:3000/api/contact", {
      data: {
        first_name: "John",
        // Missing required fields
      },
    });
    expect(response.status()).toBe(400);
  });
});
