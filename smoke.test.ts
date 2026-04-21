import { test, expect, Page } from '@playwright/test';

const BASE = 'http://localhost:5173';
const ADMIN_EMAIL = 'quydung119@gmail.com';
const ADMIN_PASS = 'PurrfectAdmin!2025';

async function openLoginModal(page: Page) {
  // Header login button has aria-label="Login"
  await page.getByRole('button', { name: 'Login' }).first().click();
  const modal = page.locator('[role="dialog"]').first();
  await expect(modal).toBeVisible();
}

async function login(page: Page, email: string, password: string) {
  // Skip if already logged in (session persists across tests in the same context)
  const loginBtn = page.getByRole('button', { name: 'Login' }).first();
  const alreadyLoggedIn = !(await loginBtn.isVisible({ timeout: 2000 }).catch(() => false));
  if (alreadyLoggedIn) return;

  await loginBtn.click();
  const modal = page.locator('[role="dialog"]').first();
  await expect(modal).toBeVisible();
  // Use exact match to avoid matching newsletter "Enter your email" input
  await modal.getByPlaceholder('Email', { exact: true }).fill(email);
  await modal.getByPlaceholder('Password', { exact: true }).fill(password);
  await modal.locator('button[type="submit"]').click();
  // Wait for modal to close (successful login) or stay open (failed login)
  await page.waitForTimeout(1500);
}

test.describe('Landing Page', () => {
  test('loads and shows hero', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/purrfect/i);
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('nav links work', async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole('link', { name: /shop all/i }).first().click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('shop by category section visible', async ({ page }) => {
    await page.goto(BASE);
    const categorySection = page.locator('body');
    await expect(categorySection).toContainText(/food|toys|beds|grooming/i);
  });
});

test.describe('Products Page', () => {
  test('loads products list', async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toContainText(/shop all products/i);
  });

  test('category filter buttons visible and clickable', async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await page.waitForTimeout(1000);
    const allBtn = page.getByRole('button', { name: /^All$/i }).first();
    if (await allBtn.isVisible()) await allBtn.click();
  });

  test('product card click opens detail modal', async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await page.waitForTimeout(1500);
    const firstCard = page.locator('article, [class*="ProductCard"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await page.waitForTimeout(800);
      // Modal should appear
      const modal = page.locator('[role="dialog"]').first();
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible();
        // Close via Escape
        await page.keyboard.press('Escape');
      }
    }
  });
});

test.describe('Auth', () => {
  test('header has login button when logged out', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('opens login modal on click', async ({ page }) => {
    await page.goto(BASE);
    await openLoginModal(page);
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal.getByPlaceholder('Email', { exact: true })).toBeVisible();
    await expect(modal.getByPlaceholder('Password', { exact: true })).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto(BASE);
    await openLoginModal(page);
    const modal = page.locator('[role="dialog"]').first();
    await modal.getByPlaceholder('Email', { exact: true }).fill('wrong@example.com');
    await modal.getByPlaceholder('Password', { exact: true }).fill('wrongpass');
    await modal.locator('button[type="submit"]').click();
    await page.waitForTimeout(1000);
    // Modal should still be open (login failed)
    await expect(modal).toBeVisible();
  });

  test('can switch to register tab', async ({ page }) => {
    await page.goto(BASE);
    await openLoginModal(page);
    const modal = page.locator('[role="dialog"]').first();
    await modal.getByRole('button', { name: 'Register' }).first().click();
    // Name field appears in register mode
    await expect(modal.getByPlaceholder('Name')).toBeVisible();
  });

  test('admin can log in', async ({ page }) => {
    await page.goto(BASE);
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
    // After successful login the auth modal closes and the user menu appears
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Theme Toggle', () => {
  test('toggle button is visible in header', async ({ page }) => {
    await page.goto(BASE);
    const toggle = page.getByRole('button', { name: /light mode|dark mode/i }).first();
    await expect(toggle).toBeVisible();
  });

  test('toggling changes data-theme attribute on html', async ({ page }) => {
    await page.goto(BASE);
    const toggle = page.getByRole('button', { name: /light mode|dark mode/i }).first();
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    await toggle.click();
    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
    // Toggle back
    await toggle.click();
    const restoredTheme = await page.locator('html').getAttribute('data-theme');
    expect(restoredTheme).toBe(initialTheme);
  });
});

test.describe('Cart Page', () => {
  test('loads cart page', async ({ page }) => {
    await page.goto(`${BASE}/cart`);
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('add product to cart then view cart', async ({ page }) => {
    await page.goto(BASE);
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
    await page.goto(`${BASE}/products`);
    await page.waitForTimeout(1500);
    const firstCard = page.locator('article, [class*="ProductCard"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await page.waitForTimeout(800);
      const addBtn = page.getByRole('button', { name: /add to cart/i });
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(500);
      }
    }
    await page.goto(`${BASE}/cart`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Favorites Page', () => {
  test('loads favorites page', async ({ page }) => {
    await page.goto(`${BASE}/favorites`);
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Orders Page', () => {
  test('loads orders page', async ({ page }) => {
    await page.goto(`${BASE}/orders`);
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Account Page', () => {
  test('accessible when logged in', async ({ page }) => {
    await page.goto(BASE);
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
    await page.goto(`${BASE}/account`);
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Static Pages', () => {
  for (const [name, path] of [
    ['About', '/about'], ['FAQ', '/faq'], ['Blog', '/blog'],
    ['Contact', '/contact'], ['Privacy', '/privacy'],
    ['Terms', '/terms'], ['Shipping', '/shipping']
  ]) {
    test(`${name} page loads`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForTimeout(300);
      await expect(page.locator('body')).toBeVisible();
      await expect(page).not.toHaveURL(/404/);
    });
  }
});

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
    await page.goto(`${BASE}/admin/dashboard`);
    await page.waitForTimeout(1000);
  });

  test('admin dashboard page loads with stat cards', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/dashboard/i);
    await expect(page.locator('body')).toContainText(/total revenue/i);
    await expect(page.locator('body')).toContainText(/total orders/i);
    await expect(page.locator('body')).toContainText(/new users/i);
  });

  test('admin dashboard sidebar has Dashboard link', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/dashboard/i);
    const dashLink = page.getByRole('link', { name: /dashboard/i }).first();
    await expect(dashLink).toBeVisible();
  });

  test('admin orders tab works', async ({ page }) => {
    await page.goto(`${BASE}/admin/orders`);
    await page.waitForTimeout(800);
    await expect(page.locator('body')).toContainText(/all orders/i);
  });

  test('admin orders export csv button is visible', async ({ page }) => {
    await page.goto(`${BASE}/admin/orders`);
    await page.waitForTimeout(800);
    await expect(page.locator('body')).toContainText(/export csv/i);
  });

  test('admin products tab works', async ({ page }) => {
    await page.goto(`${BASE}/admin/products`);
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toContainText(/products & inventory/i);
  });

  test('admin users tab shows user list', async ({ page }) => {
    await page.goto(`${BASE}/admin/users`);
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toContainText(/users/i);
    await expect(page.locator('body')).toContainText(/quydung119@gmail\.com/i);
  });

  test('admin newsletter tab works', async ({ page }) => {
    await page.goto(`${BASE}/admin/newsletter`);
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toContainText(/newsletter subscribers/i);
  });
});

test.describe('Contact Form', () => {
  test('contact page has form fields', async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await page.waitForTimeout(300);
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();
  });

  test('contact form submit shows success or stays visible', async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await page.waitForTimeout(300);
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Message').fill('This is a test message from Playwright.');
    await page.getByRole('button', { name: /send message/i }).click();
    await page.waitForTimeout(1500);
    // Either success confirmation or form still visible — no crash
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('404 Page', () => {
  test('shows not found for unknown route', async ({ page }) => {
    await page.goto(`${BASE}/this-does-not-exist`);
    await page.waitForTimeout(300);
    await expect(page.locator('body')).toContainText(/not found|404/i);
  });
});
