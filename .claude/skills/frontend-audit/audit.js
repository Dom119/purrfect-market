/**
 * Renders Purrfect Market pages with Playwright (light + dark mode) and saves
 * screenshots for visual review. Handles starting/stopping dev servers and,
 * for user/admin scope, provisioning a throwaway test account.
 *
 * Usage:
 *   node audit.js --scope=public|user|admin|all --out=<dir> [--routes=/a,/b]
 *
 * Prints a JSON manifest to stdout: [{ route, light, dark }, ...]
 */
const { chromium, request } = require('playwright');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..', '..');
const BASE = 'http://localhost:5173';
const API = 'http://localhost:8080';
const H2_JAR = execSync("find ~/.m2/repository/com/h2database -iname 'h2-*.jar' | head -1").toString().trim();
const AUDIT_EMAIL_PREFIX = 'frontend-audit-';
const AUDIT_USER = { name: 'Frontend Audit Bot', email: `${AUDIT_EMAIL_PREFIX}user@example.test`, password: 'FrontendAudit!2026' };
const AUDIT_ADMIN = { name: 'Frontend Audit Admin', email: `${AUDIT_EMAIL_PREFIX}admin@example.test`, password: 'FrontendAudit!2026' };

const PUBLIC_ROUTES = ['/', '/products', '/blog', '/about', '/privacy', '/terms', '/shipping', '/contact', '/faq', '/cart', '/favorites', '/this-route-does-not-exist'];
const USER_ROUTES = ['/orders', '/account'];
const ADMIN_ROUTES = ['/admin/dashboard', '/admin/orders', '/admin/products', '/admin/newsletter', '/admin/subscribers', '/admin/reviews', '/admin/users'];

function parseArgs() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }));
  return {
    scope: args.scope || 'public',
    out: args.out || path.join(REPO, '.frontend-audit-tmp'),
    routes: args.routes ? args.routes.split(',') : null,
  };
}

async function waitForPort(port, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://localhost:${port}`, { method: 'GET' });
      if (res.status) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 1500));
  }
  throw new Error(`port ${port} never came up`);
}

function isPortUp(port) {
  try {
    execSync(`lsof -ti:${port}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function killPort(port) {
  try { execSync(`lsof -ti:${port} | xargs kill`, { stdio: 'pipe' }); } catch {}
}

function startBackend() {
  const child = spawn('mvn', ['-f', 'Backend/pom.xml', 'spring-boot:run'], { cwd: REPO, detached: true, stdio: 'ignore' });
  child.unref();
}

function startFrontend() {
  const child = spawn('npm', ['--prefix', 'Frontend', 'run', 'dev'], { cwd: REPO, detached: true, stdio: 'ignore' });
  child.unref();
}

function h2Sql(sql) {
  return execSync(
    `java -cp "${H2_JAR}" org.h2.tools.Shell -url "jdbc:h2:file:./data/purrfect" -user sa -password "" -sql "${sql.replace(/"/g, '\\"')}"`,
    { cwd: path.join(REPO, 'Backend') }
  ).toString();
}

async function registerIfMissing(user) {
  const ctx = await request.newContext();
  await ctx.post(`${API}/api/auth/register`, {
    data: { name: user.name, email: user.email, password: user.password },
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {});
  await ctx.dispose();
}

/** Promotes the admin audit account to MAIN_ADMIN. Requires stopping the
 *  backend briefly for exclusive H2 file access, then restarting it. */
async function promoteAdmin() {
  const backendWasUp = isPortUp(8080);
  if (backendWasUp) killPort(8080);
  await new Promise(r => setTimeout(r, 2000));
  h2Sql(`UPDATE users SET user_group = 'MAIN_ADMIN' WHERE email = '${AUDIT_ADMIN.email}';`);
  startBackend();
  await waitForPort(8080);
}

async function cleanupAuditAccounts() {
  const backendWasUp = isPortUp(8080);
  if (backendWasUp) killPort(8080);
  await new Promise(r => setTimeout(r, 2000));
  h2Sql(`DELETE FROM users WHERE email LIKE '${AUDIT_EMAIL_PREFIX}%@example.test';`);
  if (backendWasUp) {
    startBackend();
    await waitForPort(8080);
  }
}

async function loginCookies(user) {
  const ctx = await request.newContext();
  const res = await ctx.post(`${API}/api/auth/login`, {
    data: { email: user.email, password: user.password },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok()) throw new Error(`login failed for ${user.email}: ${res.status()}`);
  const state = await ctx.storageState();
  await ctx.dispose();
  return state;
}

function slugify(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
}

async function captureRoute(context, route, outDir) {
  const page = await context.newPage();
  const slug = slugify(route);
  const entry = { route, light: null, dark: null };

  // Force each theme explicitly — don't rely on the default (no stored
  // preference falls back to prefers-color-scheme, which some headless
  // browsers resolve to "dark", silently making the "light" shot wrong).
  await page.goto(`${BASE}${route}`, { waitUntil: 'load' }).catch(() => {});
  await page.evaluate(() => localStorage.setItem('color-theme', 'light'));
  await page.reload({ waitUntil: 'load' }).catch(() => {});
  await page.waitForTimeout(1200);
  entry.light = path.join(outDir, `${slug}-light.png`);
  await page.screenshot({ path: entry.light, fullPage: true });

  await page.evaluate(() => localStorage.setItem('color-theme', 'dark'));
  await page.reload({ waitUntil: 'load' }).catch(() => {});
  await page.waitForTimeout(1200);
  entry.dark = path.join(outDir, `${slug}-dark.png`);
  await page.screenshot({ path: entry.dark, fullPage: true });

  await page.close();
  return entry;
}

(async () => {
  const { scope, out, routes: routeOverride } = parseArgs();
  fs.mkdirSync(out, { recursive: true });

  let routes = routeOverride;
  if (!routes) {
    routes = [];
    if (scope === 'public' || scope === 'all') routes.push(...PUBLIC_ROUTES);
    if (scope === 'user' || scope === 'all') routes.push(...USER_ROUTES);
    if (scope === 'admin' || scope === 'all') routes.push(...ADMIN_ROUTES);
  }

  const startedBackend = !isPortUp(8080);
  const startedFrontend = !isPortUp(5173);
  if (startedBackend) startBackend();
  if (startedFrontend) startFrontend();
  if (startedBackend) await waitForPort(8080);
  if (startedFrontend) await waitForPort(5173);

  let storageState = undefined;
  const needsAuth = scope === 'user' || scope === 'admin' || scope === 'all';
  if (needsAuth) {
    const account = scope === 'admin' || scope === 'all' ? AUDIT_ADMIN : AUDIT_USER;
    await registerIfMissing(account);
    if (scope === 'admin' || scope === 'all') {
      await promoteAdmin();
    }
    storageState = await loginCookies(account);
  }

  // Public product-detail page needs a real product id.
  if (routes.includes('/products')) {
    try {
      const ctx = await request.newContext();
      const res = await ctx.get(`${API}/api/products`);
      const products = await res.json();
      if (products[0]) routes.push(`/products/${products[0].id}`);
      await ctx.dispose();
    } catch {}
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState, viewport: { width: 1280, height: 900 } });

  const manifest = [];
  for (const route of routes) {
    manifest.push(await captureRoute(context, route, out));
  }

  await browser.close();

  if (needsAuth) await cleanupAuditAccounts();
  if (startedFrontend) killPort(5173);
  if (startedBackend) killPort(8080);

  console.log(JSON.stringify(manifest, null, 2));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
